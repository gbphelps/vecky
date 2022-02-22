import Polynomial from './polynomial';
import { lerp, oppSigns } from './misc';

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

  const intervals: number[] = [];
  const roots = [];

  const getT = (i: number) => lerp(range[0], range[1], i / numSegments);

  for (let i = 0; i <= numSegments; i++) {
    const t = getT(i);
    const ans = fn(t);

    if (Math.abs(ans) < precision) {
      roots.push(t);
      intervals.push(0);
    } else {
      intervals.push(ans);
    }

    if (i > 0 && oppSigns(ans, intervals[intervals.length - 1])) {
      const res = processBracket({
        fn,
        x: [getT(i - 1), t],
        precision,
        iterations: maxIterations,
      });

      roots.push(res);
    }
  }

  return roots;
}

function abstractQuadraticRoots(a: Polynomial, b: Polynomial, c: Polynomial) {
  const sqrt = b.pow(2).minus(a.times(c).times(4));
  const twoA = a.times(2);
  const negB = b.times(-1);

  const imaginaryBounds = findRoots({
    fn: sqrt.evaluate,
    range: [0, 1],
    numSegments: 20,
    precision: 1e-16,
    maxIterations: Infinity,
  });

  function rootFn(t: number) {
    // need to find the roots on this function to find "no-no" zones
    // pass these in the result

    const oneRoot = Object.keys(sqrt.coefficients).length === 0;

    const p1 = negB.evaluate(t);
    const p2 = sqrt.evaluate(t);
    const denom = twoA.evaluate(t);

    const roots = oneRoot ? [p1 / denom] : [
      (p1 + Math.sqrt(p2)) / denom,
      (p1 - Math.sqrt(p2)) / denom,
    ];

    return roots;
  }

  return {
    rootFn,
    imaginaryBounds,
  };
}

export { findRoots, abstractQuadraticRoots, processBracket };
