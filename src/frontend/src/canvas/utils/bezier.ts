import Polynomial from './polynomial';
import Vec2 from './vec2';
import { lerp } from './misc';

const ONE_MINUS_T = new Polynomial([1, -1]);
const T = new Polynomial([0, 1]);

const factorial = (function closure() {
  const lookup: Record<number, number> = {};
  return function f(n: number): number {
    if (lookup[n]) return lookup[n];
    if (n === 0) return 1;
    const ans = n * f(n - 1);
    lookup[n] = ans;
    return ans;
  };
}());

function binCoeff(n: number, k: number) {
  return factorial(n) / factorial(k) / factorial(n - k);
}

function bezierOfDegree(n: number) {
  return function bez(...p: number[]) {
    let poly = new Polynomial();

    for (let i = 0; i < n; i++) {
      poly = poly.plus(
        ONE_MINUS_T
          .pow(n - i - 1)
          .times(T.pow(i))
          .times(binCoeff(n - 1, i))
          .times(p[i]),
      );
    }
    return poly;
  };
}

const cubicBezier = bezierOfDegree(4);
const quadraticBezier = bezierOfDegree(3);

function getRootsFromCoefficients(nums: number[]): number[] {
  if (nums.length === 3) {
    const [c, b, a] = nums;
    const partA = -b / (2 * a);
    const partB = Math.sqrt(b ** 2 - 4 * a * c) / (2 * a);
    return [partA + partB, partA - partB];
  }

  if (nums.length === 2) {
    const [b, m] = nums;
    return [-b / m];
  }

  if (nums.length === 1) return [];

  throw new Error('Degree is too high or too low');
}

function range(curve: Polynomial): [number, number] {
  const coeffs: number[] = new Array(4).fill(0);

  const diff = curve.differentiate();
  Object.keys(diff.coefficients).forEach((k) => {
    const deg = curve.parseKey(k)[0];
    coeffs[deg] = diff.coefficients[k];
  });

  while (coeffs.length && coeffs[coeffs.length - 1] === 0) coeffs.pop();
  if (!coeffs.length) return [0, 0];

  const roots = getRootsFromCoefficients(coeffs);

  let [min, max] = [curve.evaluate(0), curve.evaluate(1)]
    .sort((a, b) => a - b);

  roots.forEach((tval) => {
    if (tval > 1 || tval < 0) return;

    const val = curve.evaluate(tval);
    if (val < min) min = val;
    if (val > max) max = val;
  });

  return [min, max];
}

function split(points: number[], t: number) {
  let arr = points;
  const c1 = [points[0]];
  const c2 = [points[points.length - 1]];

  while (arr.length > 1) {
    const newArr = [];
    for (let i = 1; i < arr.length; i++) {
      const val = lerp(arr[i - 1], arr[i], t);
      newArr.push(val);
    }
    c1.push(newArr[0]);
    c2.unshift(newArr[newArr.length - 1]);
    arr = newArr;
  }

  return [c1, c2];
}

function split2d(points: Vec2[], t: number) {
  const x = points.map((p) => p.x);
  const y = points.map((p) => p.y);

  const [x1, x2] = split(x, t);
  const [y1, y2] = split(y, t);

  return [
    x1.map((xVal, i) => new Vec2(xVal, y1[i])),
    x2.map((xVal, i) => new Vec2(xVal, y2[i])),
  ];
}

function bezier2d(points: Vec2[]) {
  const x = bezierOfDegree(points.length)(...points.map((p) => p.x));
  const y = bezierOfDegree(points.length)(...points.map((p) => p.y));
  return {
    x, y,
  };
}

type BBox = {
  x: [number, number],
  y: [number, number]
}

function getOverlap(a: BBox, b: BBox): BBox | null {
  const noXOverlap = a.x[0] > b.x[1] || b.x[0] > a.x[1];
  if (noXOverlap) return null;

  const noYOverlap = a.y[0] > b.y[1] || b.y[0] > a.y[1];
  if (noYOverlap) return null;

  return {
    x: [
      Math.max(a.x[0], b.x[0]),
      Math.min(a.x[1], b.x[1]),
    ],
    y: [
      Math.max(a.y[0], b.y[0]),
      Math.min(a.y[1], b.y[1]),
    ],
  };
}

function bbox(points: Vec2[]): BBox {
  const b = bezier2d(points);

  const xRange = range(b.x);
  const yRange = range(b.y);

  return {
    x: xRange,
    y: yRange,
  };
}

export {
  cubicBezier,
  quadraticBezier,
  binCoeff,
  factorial,
  range,
  bezierOfDegree,
  split,
  split2d,
  bezier2d,
  bbox,
  getOverlap,
};

export type { BBox };
