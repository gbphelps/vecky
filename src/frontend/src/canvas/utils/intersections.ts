import {
  bezierOfDegree,
} from './bezier';
import Vec2 from './vec2';
import { getAbstractCubicRoots } from './abstractRoots';

// function intersections(a: Vec2[], b: Vec2[], iterations: number): Vec2[] {
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

function intersections(aPoints: Vec2[], bPoints: Vec2[]) {
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
  const cubicRoots = getAbstractCubicRoots(A, B, C, D);

  const root1 = (t: number) => cubicRoots(t)[0];
  const root2 = (t: number) => cubicRoots(t)[1];
  const root3 = (t: number) => cubicRoots(t)[2];

  // insert dim0 function to convert all to dim1

  zero2.get1dSolver(1, { 0: root1 });
}

export default intersections;
