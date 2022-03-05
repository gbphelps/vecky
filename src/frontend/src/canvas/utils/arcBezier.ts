import Vec2 from './vec2';
import Shape from '../entities/shape';
import Registry from '../entities/registry';
import Point from '../entities/points/point';
import Layer from '../entities/layers/layer';

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

function makeCircleShape(args: {
  radius: number,
  center: Vec2,
  nSeg: number,
  shapeRegistry: Registry<Shape>,
  pointRegistry: Registry<Point>,
  layer: Layer
}) {
  const {
    radius,
    center,
    nSeg,
    shapeRegistry,
    pointRegistry,
    layer,
  } = args;

  const circle = fullCircle({
    radius,
    center,
    nSeg,
  });

  const shape = new Shape({
    shapeRegistry,
    pointRegistry,
    layer,
  });

  circle.pop();
  for (let i = 0; i < circle.length / 3; i++) {
    const s = i * 3;
    const point = circle[s];
    const prev = circle[s - 1] ?? circle[circle.length - 1];
    shape.push(point);
    shape.lastPoint().setHandle('prev', prev);
  }

  shape.close();

  return shape;
}

export { fullCircle, makeCircleShape };
export default arcBezier;
