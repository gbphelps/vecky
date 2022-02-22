import { processBracket, findRoots } from '../roots';
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

describe('find roots', () => {
  const a = new Polynomial([-4, 1]); // x - 4
  const b = new Polynomial([-3, 2]); // 2x - 3
  const c = new Polynomial([-2, 4]); // 4x - 2

  const fn = (x: number) => a.times(b).times(c).evaluate(x);

  const roots = findRoots({
    fn,
    range: [0, 5],
    numSegments: 100,
    precision: 1e-16,
    maxIterations: Infinity,
  });

  test('finds correct number of roots', () => {
    expect(roots.length).toEqual(3);
  });

  [0.5, 1.5, 4].forEach((expected, i) => {
    test(`Root ${i + 1} should equal ${expected}`, () => {
      expect(roots[i]).toBeCloseTo(expected, 15);
    });
  });
});
