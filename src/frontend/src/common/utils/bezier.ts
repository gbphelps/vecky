import Polynomial from './polynomial';

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

function bezierOfOrder(n: number) {
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

const cubicBezier = bezierOfOrder(4);
const quadraticBezier = bezierOfOrder(3);

export {
  cubicBezier,
  quadraticBezier,
  binCoeff,
  factorial,
};
