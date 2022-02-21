import Vec2 from '../vec2';
import { bezierOfDegree } from './bezier';
import { findRoots, abstractQuadraticRoots } from './roots';

function commonTangents(
  points1: Vec2[],
  points2: Vec2[],
) {
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

  // constraint: same tangent
  // db.y / db.x = da.y /da.x
  const zero1 = db.y.times(da.x)
    .minus(
      da.y.times(db.x),
    );

  // solve for dim 0 (s) in terms of dim 1 (t)
  const [C, B, A] = zero1.decompose(0);

  const roots = abstractQuadraticRoots(A, B, C);
  const root1 = (t: number) => roots(t)[0];
  const root2 = (t: number) => roots(t)[1];

  // constraint: line between them matches tangent
  // da.y / da.x = (a.y - b.y) / (a.x - b.x)
  const zero2 = da.y.times(a.x.minus(b.x))
    .minus(
      da.x.times(a.y.minus(b.y)),
    );

  // transform everything into dim 1 (t)
  const solver = zero2.get1dSolver(1, { 0: root1 });

  const solutions = findRoots(solver);
  // todo implement me!
  // check this solver between t=0 and t=1 at various intervals,
  // then run some numeric solver (secant method?) on the brackets found
}

export default commonTangents;
