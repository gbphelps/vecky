import Vec2 from './vec2';

function arcBezier(args: { start: Vec2, center: Vec2, theta: number }) {
  const { start: startPoint, center, theta } = args;
  const pDist = (4 / 3) * Math.tan(1 / 4 * theta);

  const startVec = startPoint.minus(center);
  const endVec = startVec.rotate(theta);

  const endPoint = endVec.plus(center);

  const p1 = startVec
    .rotate(Math.PI / 2)
    .times(pDist);

  const p2 = endVec
    .rotate(-Math.PI / 2)
    .times(pDist);

  return [
    startPoint,
    startPoint.plus(p1),
    endPoint.plus(p2),
    endPoint];
}

function fullCircle(args: {
  radius: number,
  center: Vec2,
  nSeg: number
}) {
  const { radius, center, nSeg } = args;
  const theta = 2 * Math.PI / nSeg;
  const pInit = center.plus(new Vec2(0, -radius));
  const points = [];

  let start = pInit;
  for (let i = 0; i < nSeg; i++) {
    const ps = arcBezier({ start, center, theta });
    start = ps.pop() as Vec2;
    points.push(...ps);
  }

  points.push(start);
  return points;
}

export { fullCircle };
export default arcBezier;
