import Polynomial from './polynomial';

function cubicBezier(
  a: number,
  b: number,
  c: number,
  d: number,
): Polynomial {
  const oneMinusT = new Polynomial([1, -1]);
  const t = new Polynomial([0, 1]);

  return oneMinusT.pow(3).scale(a)
    .plus(
      oneMinusT.pow(2).times(t).times(3 * b),
    )
    .plus(
      oneMinusT.times(t.pow(2)).times(3 * c),
    )
    .plus(
      t.pow(3).times(d),
    );
}

export { cubicBezier };
