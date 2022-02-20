import Polynomial from '../polynomial';

describe('Polynomial', () => {
  test('simple case', () => {
    const a = new Polynomial([1, 1]);
    const b = new Polynomial([1, 1]);
    expect(a.times(b).coefficients).toEqual([1, 2, 1]);
  });

  test('complicated case', () => {
    const c = new Polynomial([1, 2, 0, 4]);
    const b = new Polynomial([0, 5, 6]);
    expect(c.times(b).coefficients).toEqual([0, 5, 16, 12, 20, 24]);
  });

  test('negative values', () => {
    const c = new Polynomial([1, -2, 0, 0, 7]);
    const b = new Polynomial([0, -5, 0, -3, 0]);
    expect(c.times(b).coefficients).toEqual([0, -5, 10, -3, 6, -35, 0, -21]);
  });
});
