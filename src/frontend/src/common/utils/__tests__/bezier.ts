import { cubicBezier } from '../bezier';

describe('cubic', () => {
  test('basic', () => {
    const b = cubicBezier(2, 5, 0, 7);
    expect(b.evaluate(0)).toEqual(2);
    expect(b.evaluate(1)).toEqual(7);
  });
  test('basic', () => {
    const b = cubicBezier(3, 3, 1, 1);
    expect(b.evaluate(0.5)).toEqual(2);
    expect(b.evaluate(0)).toEqual(3);
    expect(b.evaluate(1)).toEqual(1);
  });
});
