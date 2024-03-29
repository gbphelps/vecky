import X from 'complex.js';
import Polynomial from './polynomial';

function getAbstractCubicRoots(A:Polynomial, B:Polynomial, C:Polynomial, D:Polynomial) {
  if (A.isZero()) return getAbstractQuadraticRoots(B, C, D);

  const qTop = A.times(C).times(3).minus(B.pow(2));
  const qBtm = A.pow(2).times(9);
  const rTop = A.times(B).times(C).times(9)
    .minus(
      A.pow(2).times(D).times(27),
    )
    .minus(
      B.pow(3).times(2),
    );
  const rBtm = A.pow(3).times(54);

  const lookup: Record<number, number[]> = {};

  function rootFn(t: number): number[] {
    if (lookup[t]) return lookup[t];

    const R = rTop.evaluate(t) / rBtm.evaluate(t);
    const Q = qTop.evaluate(t) / qBtm.evaluate(t);
    const QR = new X(Q ** 3 + R ** 2).pow(1 / 2);

    const S = (new X(R).add(QR)).pow(1 / 3);
    const T = (new X(R).sub(QR)).pow(1 / 3);

    const BA = B.evaluate(t) / (3 * A.evaluate(t));
    const IST = new X(0, Math.sqrt(3) / 2).mul(S.sub(T));
    const STBA = S.add(T).div(-2).sub(BA);

    const res = [
      S.add(T).sub(BA),
      STBA.add(IST),
      STBA.sub(IST),
    ]
      .filter((a) => Math.abs(a.im) < 1e-10)
      .map((a) => a.re);

    lookup[t] = res;
    return res;
  }

  return rootFn;
}

function getAbstractQuadraticRoots(a: Polynomial, b: Polynomial, c: Polynomial) {
  if (a.isZero()) return getAbstractLinearRoot(b, c);

  const sqrt = b.pow(2).minus(a.times(c).times(4));
  const twoA = a.times(2);
  const negB = b.times(-1);

  const lookup: Record<number, number[]> = {};

  function rootFn(t: number) {
    if (lookup[t]) return lookup[t];
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

    lookup[t] = roots;

    return roots;
  }

  return rootFn;
}

function getAbstractLinearRoot(A: Polynomial, B: Polynomial) {
  return (t: number) => [B.times(-1).evaluate(t) / A.evaluate(t)];
}

export { getAbstractCubicRoots, getAbstractQuadraticRoots };
