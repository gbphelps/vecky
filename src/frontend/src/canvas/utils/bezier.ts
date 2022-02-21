import Polynomial from './polynomial';
import Vec2 from '../vec2';

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

// note: minimatrix-polyroots for 2 higher degrees
function getRoots(nums: number[]): number[] {
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

function range(curve: Polynomial) {
  const coeffs: number[] = new Array(4).fill(0);

  const diff = curve.differentiate();
  Object.keys(diff.coefficients).forEach((k) => {
    const deg = curve.parseKey(k)[0];
    coeffs[deg] = diff.coefficients[k];
  });

  while (coeffs.length && coeffs[coeffs.length - 1] === 0) coeffs.pop();

  const roots = getRoots(coeffs);

  let [min, max] = [curve.evaluate(0), curve.evaluate(1)]
    .sort((a, b) => a - b);

  roots.forEach((tval) => {
    if (tval > 1 || tval < 0) return;

    const val = curve.evaluate(tval);
    if (val < min) min = val;
    if (val > max) max = val;
  });

  return { min, max };
}

function commonTangents(
  points1: Vec2[],
  points2: Vec2[],
) {
  const [a, b] = [points1, points2].map((points, i) => {
    const n = points.length;
    const x = bezierOfDegree(n)(...points.map((p) => p.x));
    const y = bezierOfDegree(n)(...points.map((p) => p.y));
    return {
      x: x.unproject(1 - i),
      y: y.unproject(1 - i),
    };
  });

  const [da, db] = [a, b].map((curve, i) => ({
    x: curve.x.differentiate(i),
    y: curve.y.differentiate(i),
  }));

  // constraint: same tangent
  // db.y / db.x = da.y /da.x
  const zero1 = db.y.times(da.x)
    .minus(
      da.y.times(db.x),
    );
  const [C, B, A] = zero1.decompose(0); // solves for x

  const roots = abstractQuadraticRoots(A, B, C);
  const root1 = (t: number) => roots(t)[0];
  const root2 = (t: number) => roots(t)[1];

  // constraint: line between them matches tangent
  // da.y / da.x = (a.y - b.y) / (a.x - b.x)
  const zero2 = da.y.times(a.x.minus(b.x))
    .minus(
      da.x.times(a.y.minus(b.y)),
    );

  zero2.getSolver(1, { 0: root1 });
}

function abstractQuadraticRoots(a: Polynomial, b: Polynomial, c: Polynomial) {
  return function roots(t: number) {
    const denom = a.times(2).evaluate(t);
    const p1 = b.times(-1).evaluate(t);
    const p2 = b.pow(2).minus(a.times(c).times(4)).evaluate(t);
    return [
      (p1 + p2) / denom,
      (p1 - p2) / denom,
    ];
  };
}

export {
  cubicBezier,
  quadraticBezier,
  binCoeff,
  factorial,
  range,
  bezierOfDegree,
};
