import {
  bezierOfDegree,
  bbox,
  getOverlap,
  split2d,
} from './bezier';
import Vec2 from './vec2';
import { getAbstractCubicRoots } from './abstractRoots';
import { findRoots } from './roots';

/*
  generate back-of-napkin ranges for the intersections.

  Approach is to calculate bboxes if curve a and b. If
  they overlap, split both curves in half. For each of
  the four resulting combinations of curve pieces,
  repeat. Do this for a given number of iterations
  or bail early if the bounding boxes are small enough
  to indicate we've essentially found the answer.

  We do this step first because the more precise equality
  we run in `intersections()` is in t and s and can
  miss intersections due to extreme slopes, undefined regions,
  and asymptotes.

  This calculates intersections in x and y rather than
  t and s, which is much more reliable for rough calculations,
  but becomes less and less precise with each iteration
  due to compounded error margins from the split() function.

  This method shrinks the "regions of interest" that need
  to be investigated with `intersections()`, while still
  allowing us to get essentially double float precision
  (1e-16) compared to a MAX of about 1e-12 by using
  just this roughIntersections method.
*/
function roughIntersections(
  a: Vec2[],
  b: Vec2[],
) {
  return _rough(
    a,
    b,
    10,
    0,
    0,
    1,
  );
}

function _rough(
  a: Vec2[],
  b: Vec2[],
  iterations: number,
  ta: number,
  tb: number,
  size: number,
): {
  ta: [number, number],
  tb: [number, number]
}[] {
  let res: {
    ta: [number, number],
    tb: [number, number]
  }[] = [];

  const boxA = bbox(a);
  const boxB = bbox(b);

  const overlap = getOverlap(boxA, boxB);
  if (!overlap) return res;

  const delx = overlap.x[1] - overlap.x[0];
  const dely = overlap.y[1] - overlap.y[0];

  if (delx ** 2 + dely ** 2 < 1e-16 ** 2 || iterations === 0) {
    return [{
      ta: [ta, ta + size],
      tb: [tb, tb + size],
    }];
  }

  const aSplit = split2d(a, 0.5);
  const bSplit = split2d(b, 0.5);
  const newSize = size / 2;

  aSplit.forEach((aPiece, i) => {
    bSplit.forEach((bPiece, j) => {
      res = res.concat(
        _rough(
          aPiece,
          bPiece,
          iterations - 1,
          ta + (i * newSize),
          tb + (j * newSize),
          newSize,
        ),
      );
    });
  });

  return res;
}

function intersections(aPoints: Vec2[], bPoints: Vec2[]): Vec2[] {
  const checkpoints = roughIntersections(aPoints, bPoints).map(({ tb }) => tb);

  const [a, b] = [aPoints, bPoints].map((points, i) => {
    const bz = bezierOfDegree(points.length);
    const x = bz(...points.map((p) => p.x)).unproject(1 - i);
    const y = bz(...points.map((p) => p.y)).unproject(1 - i);
    return { x, y };
  });

  // condition 1: a.x === b.x
  const zero1 = a.x.minus(b.x);

  // condition 2 a.y === b.y
  const zero2 = a.y.minus(b.y);

  // note that these unfortunately
  // are both 3rd degree polynomials :(

  // solve for dim0 in terms of dim1
  const [D, C, B, A] = zero1.decompose(0);
  const { rootFn } = getAbstractCubicRoots(A, B, C, D);

  const root1 = (t: number) => rootFn(t)[0] ?? NaN;
  const root2 = (t: number) => rootFn(t)[1] ?? NaN;
  const root3 = (t: number) => rootFn(t)[2] ?? NaN;

  // insert dim0 function to convert all to dim1

  let results: number[] = [];
  [root1, root2, root3].forEach((r) => {
    const solver = zero2.get1dSolver(1, { 0: r });

    for (let i = 0; i < checkpoints.length; i++) {
      const range = checkpoints[i];
      results = results.concat(findRoots({
        fn: solver,
        range,
        numSegments: 10,
        maxIterations: 20,
        precision: 1e-16,
      }));
    }
  });

  return results
    .filter((n) => !Number.isNaN(n))
    .map((s) => new Vec2(
      b.x.evaluate([0, s]),
      b.y.evaluate([0, s]),
    ));
}

export default intersections;
