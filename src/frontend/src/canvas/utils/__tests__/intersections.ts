import { getAbstractCubicRoots, getAbstractQuadraticRoots } from '../abstractRoots';
import Polynomial from '../polynomial';

describe('getAbstractCubicRoots', () => {
  test('sanity check', () => {
    const neg3 = new Polynomial([6, 2]);
    const pos2 = new Polynomial([2, -1]);
    const pos5 = new Polynomial([-5, 1]);
    const poly = neg3.times(pos2).times(pos5);

    const [A, B, C, D] = Object.keys(poly.coefficients)
      .map((p) => +p)
      .sort((a, b) => b - a)
      .map((key) => poly.coefficients[key])
      .map((c) => new Polynomial([c]));

    const ans = getAbstractCubicRoots(A, B, C, D).rootFn(
      // this can be anything since polynomials are 0 order
      0,
    )
      .sort((a: number, b: number) => a - b);

    expect(ans[0]).toBeCloseTo(-3);
    expect(ans[1]).toBeCloseTo(2);
    expect(ans[2]).toBeCloseTo(5);
  });
});

describe('getAbstractQuadraticRoots', () => {
  test('sanity check', () => {
    const neg3 = new Polynomial([6, 2]);
    const pos2 = new Polynomial([2, -1]);
    const poly = neg3.times(pos2);

    const [A, B, C] = Object.keys(poly.coefficients)
      .map((p) => +p)
      .sort((a, b) => b - a)
      .map((key) => poly.coefficients[key])
      .map((c) => new Polynomial([c]));

    const ans = getAbstractQuadraticRoots(A, B, C).rootFn(
      // this can be anything since polynomials are 0 order
      0,
    )
      .sort((a: number, b: number) => a - b);

    expect(ans[0]).toBeCloseTo(-3);
    expect(ans[1]).toBeCloseTo(2);
  });
});
