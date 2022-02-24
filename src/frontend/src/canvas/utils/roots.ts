import Polynomial from './polynomial';
import { lerp } from './misc';

type SimpleFunction = (t: number) => number;

function processBracket(args: {
    fn: SimpleFunction,
    x: [number, number],
    precision: number,
    iterations: number
}): number {
  const {
    fn, x, precision, iterations,
  } = args;

  if (
    Math.abs(x[1] - x[0]) < precision ||
    iterations === 0
  ) return (x[0] + x[1]) / 2;

  const num = x[0] * fn(x[1]) - x[1] * fn(x[0]);
  const dem = fn(x[1]) - fn(x[0]);

  if (dem === 0) return (x[0] + x[1]) / 2;

  return processBracket({
    fn,
    x: [x[1], num / dem],
    precision,
    iterations: iterations - 1,
  });
}

function findRoots(args: {
    fn: SimpleFunction,
    range: [number, number],
    numSegments: number,
    precision: number,
    maxIterations: number,
}) {
  const {
    fn,
    range,
    numSegments,
    precision,
    maxIterations,
  } = args;

  const roots = [];

  const getT = (i: number) => lerp(range[0], range[1], i / numSegments);

  let prevSign = 0;
  for (let i = 0; i <= numSegments; i++) {
    const t = getT(i);
    const ans = fn(t);

    let s = ans < 0 ? -1 : 1;

    if (Math.abs(ans) < precision) {
      roots.push(t);
      s = 0;
    }

    if (prevSign && s && s !== prevSign) {
      const res = processBracket({
        fn,
        x: [getT(i - 1), t],
        precision,
        iterations: maxIterations,
      });

      roots.push(res);
    }

    prevSign = s;
  }

  return roots;
}

export { findRoots, processBracket };
