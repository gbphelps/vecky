import { cubicBezier, binCoeff, factorial } from '../bezier';

describe('cubic', () => {
  test('basic', () => {
    const b = cubicBezier(2, 5, 0, 7);
    expect(b.evaluate(0)).toEqual(2);
    expect(b.evaluate(1)).toEqual(7);
  });
  test('basic', () => {
    const b = cubicBezier(3, 3, 1, 1);

    // should be the midpoint between 3 and 1
    expect(b.evaluate(0.5)).toEqual(2);

    // endpoints always need to be equal to P0 and P3
    // respectively
    expect(b.evaluate(0)).toEqual(3);
    expect(b.evaluate(1)).toEqual(1);

    // the derivatives should be zero at both ends
    // because of [3, 3] and [1, 1]
    expect(b.differentiate().evaluate(0)).toEqual(0);
    expect(b.differentiate().evaluate(1)).toEqual(0);
  });
});

describe('factorial', () => {
  test('basic test', () => {
    expect(factorial(4)).toEqual(24);
  });
});

describe('binCoeff', () => {
  test('basic test', () => {
    expect([0, 1, 2].map((n) => binCoeff(2, n))).toEqual([1, 2, 1]);
    expect([0, 1, 2, 3].map((n) => binCoeff(3, n))).toEqual([1, 3, 3, 1]);
  });
});
