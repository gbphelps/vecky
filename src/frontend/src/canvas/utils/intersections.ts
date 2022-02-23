import { getOverlap, bbox, split2d } from './bezier';
import Vec2 from './vec2';

function intersections(a: Vec2[], b: Vec2[], iterations: number): Vec2[] {
  let res: Vec2[] = [];

  const boxA = bbox(a);
  const boxB = bbox(b);

  const overlap = getOverlap(boxA, boxB);
  if (!overlap) return res;

  const delx = overlap.x[1] - overlap.x[0];
  const dely = overlap.y[1] - overlap.y[0];

  if (delx ** 2 + dely ** 2 < 1e-16 ** 2 || iterations === 0) {
    return [new Vec2(
      (overlap.x[0] + overlap.x[1]) / 2,
      (overlap.y[0] + overlap.y[1]) / 2,
    )];
  }

  const aSplit = split2d(a, 0.5);
  const bSplit = split2d(b, 0.5);

  aSplit.forEach((aPiece) => {
    bSplit.forEach((bPiece) => {
      res = res.concat(intersections(aPiece, bPiece, iterations - 1));
    });
  });

  return res;
}

export default intersections;
