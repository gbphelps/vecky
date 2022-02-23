import Vec2 from './vec2';
import Polynomial from './polynomial';
import { findRoots } from './roots';

type SimpleFunction = (t: number) => number

interface ClosestPointArgs {
    x: Polynomial,
    y: Polynomial,
    range: [number, number],
    point: Vec2,
    iterations: number,
    numSegments: number
}

// function closestPoint(args: ClosestPointArgs): {
//   point: Vec2,
//   distance: number
// } {
//   const {
//     xf,
//     yf,
//     range,
//     point,
//     iterations,
//     numSegments,
//   } = args;

//   const times: number[] = [];

//   const inc = (range[1] - range[0]) / numSegments;
//   for (let i = 0; i <= numSegments; i++) {
//     times.push(range[0] + inc * i);
//   }

//   let best = Infinity;
//   let bestI = -Infinity;

//   const points = times.map((t) => new Vec2(
//     xf(t),
//     yf(t),
//   ));

//   const distances = points.map((p) => p.distance(point));

//   distances.forEach((d, i) => {
//     if (d > best) return;
//     best = d;
//     bestI = i;
//   });

//   const newRange: [number, number] = [
//     Math.max(0, times[bestI] - inc),
//     Math.min(1, times[bestI] + inc),
//   ];

//   if (iterations === 0) {
//     return {
//       point: points[bestI],
//       distance: distances[bestI],
//     };
//   }

//   return closestPoint({
//     xf,
//     yf,
//     range: newRange,
//     point,
//     iterations: iterations - 1,
//     numSegments: 4,
//   });
// }

type Result = {
  point: Vec2,
  distance: number
}
function closestPoint(args: ClosestPointArgs): Result {
  const {
    x,
    y,
    range,
    point,
  } = args;

  // constraint dy/dx = - (Px - x)/(Py - y);
  const dx = x.differentiate();
  const dy = y.differentiate();

  const Px = new Polynomial([point.x]);
  const Py = new Polynomial([point.y]);

  const zero = dy.times(Py.minus(y)).plus(
    dx.times(Px.minus(x)),
  );

  const zeros = findRoots({
    fn: zero.evaluate,
    range,
    maxIterations: 20,
    precision: 1e-16,
    numSegments: 100,
  });

  const opts = [0, ...zeros, 1].map((t) => {
    const pos = new Vec2(
      x.evaluate(t),
      y.evaluate(t),
    );
    const dist = pos.distance(point);
    return { point: pos, distance: dist };
  });

  return opts.reduce((a: Result, opt: Result) => {
    if (a.distance < opt.distance) return a;
    return opt;
  }, { distance: Infinity, point: new Vec2() });
}

export default closestPoint;
