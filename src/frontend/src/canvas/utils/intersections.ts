import {
  bezierOfDegree,
  // bbox,
  // getOverlap,
  // split2d,
} from './bezier';
import Vec2 from './vec2';
import { getAbstractCubicRoots } from './abstractRoots';
import { findRoots } from './roots';

// function intersections(a: Vec2[], b: Vec2[], iterations: number): Vec2[] {
//   // eslint-disable-next-line no-param-reassign
//   if (iterations == null) iterations = 20;

//   let res: Vec2[] = [];

//   const boxA = bbox(a);
//   const boxB = bbox(b);

//   const overlap = getOverlap(boxA, boxB);
//   if (!overlap) return res;

//   const delx = overlap.x[1] - overlap.x[0];
//   const dely = overlap.y[1] - overlap.y[0];

//   if (delx ** 2 + dely ** 2 < 1e-16 ** 2 || iterations === 0) {
//     return [new Vec2(
//       (overlap.x[0] + overlap.x[1]) / 2,
//       (overlap.y[0] + overlap.y[1]) / 2,
//     )];
//   }

//   const aSplit = split2d(a, 0.5);
//   const bSplit = split2d(b, 0.5);

//   aSplit.forEach((aPiece) => {
//     bSplit.forEach((bPiece) => {
//       res = res.concat(intersections(aPiece, bPiece, iterations - 1));
//     });
//   });

//   return res;
// }

function intersections(aPoints: Vec2[], bPoints: Vec2[]): Vec2[] {
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
  const { rootFn, imaginaryBounds } = getAbstractCubicRoots(A, B, C, D);

  const root1 = (t: number) => rootFn(t)[0] ?? NaN;
  const root2 = (t: number) => rootFn(t)[1] ?? NaN;
  const root3 = (t: number) => rootFn(t)[2] ?? NaN;

  // insert dim0 function to convert all to dim1

  let results: number[] = [];
  [root1, root2, root3].forEach((r) => {
    const solver = zero2.get1dSolver(1, { 0: r });
    results = results.concat(findRoots({
      fn: solver,
      range: [0, 1],
      // should probably start with the
      // naive implementation (commented out above)
      // and just use this for extra precision
      // because 5000 is a LOT of segments haha
      numSegments: 5000,
      maxIterations: 20,
      precision: 1e-16,
    }));
  });

  return results
    .filter((n) => !Number.isNaN(n))
    .map((s) => new Vec2(
      b.x.evaluate([0, s]),
      b.y.evaluate([0, s]),
    ));
}

export default intersections;
