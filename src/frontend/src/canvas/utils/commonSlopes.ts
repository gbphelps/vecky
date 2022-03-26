import Vec2 from './vec2';
import { bezierOfDegree } from './bezier';
import { findRoots } from './roots';
import { getAbstractQuadraticRoots } from './abstractRoots';

type SimpleFunction = (t: number) => number;

function commonSlopes(
  points1: Vec2[],
  points2: Vec2[],
  type: 'normal' | 'tangent',
):[Vec2, Vec2][] {
  const [a, b] = [points1, points2].map((points, i) => {
    const n = points.length;
    const x = bezierOfDegree(n)(...points.map((p) => p.x));
    const y = bezierOfDegree(n)(...points.map((p) => p.y));
    return {
      x: x.unproject(1 - i),
      y: y.unproject(1 - i),
    };
  });

  const [da, db] = [a, b].map((curve, i) => ({
    x: curve.x.differentiate(i),
    y: curve.y.differentiate(i),
  }));

  // constraint #1: same tangent
  // db.y / db.x = da.y /da.x
  const zero1 = db.y.times(da.x)
    .minus(
      da.y.times(db.x),
    );

  // solve for dim 0 (s) in terms of dim 1 (t)
  // this has max degree of [2,2], so
  // we can safely use quadratic eq on it
  const [C, B, A] = zero1.decompose(0);

  const rootFn = getAbstractQuadraticRoots(A, B, C);

  const root1 = (t: number) => rootFn(t)[0] ?? NaN;
  const root2 = (t: number) => rootFn(t)[1] ?? NaN;

  // constraint #2:
  const zero2 = type === 'tangent'
  // line between them matches tangent:
  // da.y / da.x = (a.y - b.y) / (a.x - b.x)
    ? da.y.times(a.x.minus(b.x))
      .minus(
        da.x.times(a.y.minus(b.y)),
      )
      // line between them perpendicular to tangent:
      // da.y / da.x = -(a.x - b.x) / (a.y - b.y)
    : da.y.times(a.y.minus(b.y))
      .plus(
        da.x.times(a.x.minus(b.x)),
      );

  // transform everything into dim 1 (t)
  const solver1 = zero2.get1dSolver(1, { 0: root1 });
  const solver2 = zero2.get1dSolver(1, { 0: root2 });

  const getResults = (solver: SimpleFunction) => findRoots({
    fn: solver,
    range: [0, 1],
    numSegments: 100,
    maxIterations: 20,
    precision: 1e-16,
  });

  const aResults = [...getResults(solver1), ...getResults(solver2)];

  const pairs: [number, number][] = [];

  aResults.forEach((r) => {
    const s = zero2.get1dSolver(0, { 1: () => r });
    const tOpts = getResults(s);

    const correctT = tOpts.filter(
      (t) => Math.abs(zero1.evaluate([t, r])) < 1e-8,
    )[0] ?? NaN;

    if (!Number.isNaN(correctT)) pairs.push([correctT, r]);
  });

  return pairs.map(([t, s]) => {
    const x1 = a.x.evaluate([t, 0]);
    const y1 = a.y.evaluate([t, 0]);
    const x2 = b.x.evaluate([0, s]);
    const y2 = b.y.evaluate([0, s]);

    return [
      new Vec2(x1, y1),
      new Vec2(x2, y2),
    ];
  });

  // const solutions = findRoots(solver);
  // todo implement me!
  // check this solver between t=0 and t=1 at various intervals,
  // then run some numeric solver (secant method?) on the brackets found
}

function commonTangents(a: Vec2[], b: Vec2[]) {
  return commonSlopes(a, b, 'tangent');
}

function commonNormals(a: Vec2[], b: Vec2[]) {
  return commonSlopes(a, b, 'normal');
}

export { commonTangents, commonNormals };
