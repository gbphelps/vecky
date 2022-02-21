import Polynomial from '../polynomial2';

function getMap<A, B>(arr: [A, B][]): Map<A, B> {
  const map: Map<A, B> = new Map();
  for (let i = 0; i < arr.length; i++) map.set(arr[i][0], arr[i][1]);
  return map;
}

describe('Polynomial', () => {
  describe('exponentiation', () => {
    test('basic test', () => {
      const p = new Polynomial([1, 1]);
      expect(p.pow(3).coefficients).toEqual(
        {
          0: 1,
          1: 3,
          2: 3,
          3: 1,
        },
      );
    });
    test('pow 0: always return 1', () => {
      const p = new Polynomial([1, 3, 6]);
      expect(p.pow(0).coefficients).toEqual({ 0: 1 });
    });
  });

  describe('integrate', () => {
    test('basic test', () => {
      const p = new Polynomial([1, 3, 6]);
      expect(p.integrate().coefficients).toEqual({
        1: 1,
        2: 1.5,
        3: 2,
      });
    });
  });

  describe('evaluate', () => {
    test('basic test', () => {
      const p = new Polynomial([1, 2, 3]);
      expect(p.evaluate([3])).toEqual(34);
    });
  });

  describe('init', () => {
    test('omits zeros', () => {
      const p = new Polynomial([0, 0, 0, 0]);
      expect(p.coefficients).toEqual({});
    });
  });

  describe('subtract', () => {
    test('basic test', () => {
      const a = new Polynomial([1, 2, 3, 4]);
      const b = new Polynomial([0, 0, 3, 2]);
      expect(a.minus(b).coefficients).toEqual(b.minus(a).scale(-1).coefficients);
      expect(a.minus(b).coefficients).toEqual({
        0: 1,
        1: 2,
        3: 2,
      });
    });
  });

  describe('differentiate', () => {
    test('simple case', () => {
      expect(new Polynomial([0, 1, 4, 0, 2]).differentiate().coefficients).toEqual({
        0: 1,
        1: 8,
        3: 8,
      });
    });
  });

  describe('multiply', () => {
    test('simple case', () => {
      const a = new Polynomial([-1, 1]);
      const b = new Polynomial([1, 1]);
      expect(a.times(b).coefficients).toEqual(b.times(a).coefficients);
      expect(a.times(b).coefficients).toEqual({
        0: -1,
        2: 1,
      });
    });

    test('works as alias for .scale', () => {
      const a = new Polynomial([1, 2, 3, 4]);

      expect(a.times(-2).coefficients).toEqual({
        0: -2,
        1: -4,
        2: -6,
        3: -8,
      });
    });

    test('complicated case', () => {
      const a = new Polynomial([1, 2, 0, 4]);
      const b = new Polynomial([0, 5, 6]);

      expect(a.times(b).coefficients).toEqual(b.times(a).coefficients);
      expect(a.times(b).coefficients).toEqual({
        1: 5,
        2: 16,
        3: 12,
        4: 20,
        5: 24,
      });
    });

    test('negative values', () => {
      const a = new Polynomial([1, -2, 0, 0, 7]);
      const b = new Polynomial([0, -5, 0, -3, 0]);

      expect(a.times(b).coefficients).toEqual(b.times(a).coefficients);
      expect(a.times(b).coefficients).toEqual({
        1: -5,
        2: 10,
        3: -3,
        4: 6,
        5: -35,
        7: -21,
      });
    });
  });

  describe('add', () => {
    test('simple case', () => {
      const a = new Polynomial([1, 1]);
      const b = new Polynomial([1, -1]);

      expect(a.plus(b).coefficients).toEqual(b.plus(a).coefficients);
      expect(a.plus(b).coefficients).toEqual({ 0: 2 });
    });

    test('all zero', () => {
      const a = new Polynomial([1, 2, 0, 4]);
      const b = new Polynomial([-1, -2, 0, -4]);

      expect(a.plus(b).coefficients).toEqual(b.plus(a).coefficients);
      expect(a.plus(b).coefficients).toEqual({});
    });

    test('negative values', () => {
      const a = new Polynomial([1, -2, 0, 0, 7]);
      const b = new Polynomial([0, -5, 0, -3, 0]);

      expect(a.plus(b).coefficients).toEqual(b.plus(a).coefficients);
      expect(a.plus(b).coefficients).toEqual({
        0: 1,
        1: -7,
        3: -3,
        4: 7,
      });
    });
  });
});
