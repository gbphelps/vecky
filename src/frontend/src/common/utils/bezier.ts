import Polynomial from './polynomial2';

const oneMinusT = new Polynomial([1, -1]);
const t = new Polynomial([0, 1]);

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
        oneMinusT
          .pow(n - i - 1)
          .times(t.pow(i))
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

export {
  cubicBezier,
  quadraticBezier,
  binCoeff,
  factorial,
  range,
  bezierOfDegree,
};
