import { Complex as X } from 'complex.js';
import {
  getOverlap,
  bbox,
  split2d,
  bezierOfDegree,
} from './bezier';
import Vec2 from './vec2';
import Polynomial from './polynomial';

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

function getAbstractCubicRoots(A:Polynomial, B:Polynomial, C:Polynomial, D:Polynomial) {
  const qTop = A.times(C).times(3).minus(B.pow(2));
  const qBtm = A.pow(2).times(9);
  const rTop = A.times(B).times(C).times(9)
    .minus(
      A.pow(2).times(D).times(27),
    )
    .minus(
      B.pow(3).times(2),
    );
  const rBtm = A.pow(3).times(54);

  const lookup: Record<number, number[]> = {};

  return function getRoots(t: number): number[] {
    if (lookup[t]) return lookup[t];

    const R = rTop.evaluate(t) / rBtm.evaluate(t);
    const Q = qTop.evaluate(t) / qBtm.evaluate(t);
    const QR = X(Q ** 3 + R ** 2).pow(1 / 2);

    const S = (X(R).add(QR)).pow(1 / 3);
    const T = (X(R).sub(QR)).pow(1 / 3);

    const BA = B.evaluate(t) / (3 * A.evaluate(t));
    const IST = X(0, Math.sqrt(3) / 2).mul(S.sub(T));
    const STBA = S.add(T).div(-2).sub(BA);

    const res = [
      S.add(T).sub(BA),
      STBA.add(IST),
      STBA.sub(IST),
    ]
      .filter((a) => Math.abs(a.im) < 1e-10)
      .map((a) => a.re);

    lookup[t] = res;
    return res;
  };
}

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
export { getAbstractCubicRoots };
