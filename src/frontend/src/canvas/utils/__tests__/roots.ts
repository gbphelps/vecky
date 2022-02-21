import { processBracket } from '../roots';
import Polynomial from '../polynomial';

describe('processBracket', () => {
  test('sanity check', () => {
    const a = new Polynomial([-4, 1]); // x - 4
    const b = new Polynomial([-3, 2]); // 2x - 3
    const c = new Polynomial([-2, 4]); // 4x - 2

    const fn = (x: number) => a.times(b).times(c).evaluate(x);

    expect(processBracket({
      fn,
      x: [3.5, 5.5],
      precision: 1e-16,
      iterations: Infinity,
    })).toBeCloseTo(4, 15);

    expect(processBracket({
      fn,
      x: [1, 3],
      precision: 1e-16,
      iterations: Infinity,
    })).toBeCloseTo(1.5, 15);

    expect(processBracket({
      fn,
      x: [0, 1],
      precision: 1e-16,
      iterations: Infinity,
    })).toBeCloseTo(0.5, 15);
  });
});
