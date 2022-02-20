import Polynomial from '../polynomial';

function getMap<A, B>(arr: [A, B][]): Map<A, B> {
  const map: Map<A, B> = new Map();
  for (let i = 0; i < arr.length; i++) map.set(arr[i][0], arr[i][1]);
  return map;
}

describe('Polynomial', () => {
  describe('init', () => {
    test('omits zeros', () => {
      const p = new Polynomial([0, 0, 0, 0]);
      expect(p.coefficients).toEqual(getMap([]));
    });
  });

  describe('subtract', () => {
    test('basic test', () => {
      const a = new Polynomial([1, 2, 3, 4]);
      const b = new Polynomial([0, 0, 3, 2]);
      expect(a.minus(b).coefficients).toEqual(b.minus(a).scale(-1).coefficients);
      expect(a.minus(b).coefficients).toEqual(getMap([
        [0, 1],
        [1, 2],
        [3, 2],
      ]));
    });
  });

  describe('multiply', () => {
    test('simple case', () => {
      const a = new Polynomial([-1, 1]);
      const b = new Polynomial([1, 1]);
      expect(a.times(b).coefficients).toEqual(b.times(a).coefficients);
      expect(a.times(b).coefficients).toEqual(getMap([
        [0, -1],
        [2, 1],
      ]));
    });

    test('complicated case', () => {
      const a = new Polynomial([1, 2, 0, 4]);
      const b = new Polynomial([0, 5, 6]);

      expect(a.times(b).coefficients).toEqual(b.times(a).coefficients);
      expect(a.times(b).coefficients).toEqual(getMap([
        [1, 5],
        [2, 16],
        [3, 12],
        [4, 20],
        [5, 24],
      ]));
    });

    test('negative values', () => {
      const a = new Polynomial([1, -2, 0, 0, 7]);
      const b = new Polynomial([0, -5, 0, -3, 0]);

      expect(a.times(b).coefficients).toEqual(b.times(a).coefficients);
      expect(a.times(b).coefficients).toEqual(getMap([
        [1, -5],
        [2, 10],
        [3, -3],
        [4, 6],
        [5, -35],
        [7, -21],
      ]));
    });
  });

  describe('add', () => {
    test('simple case', () => {
      const a = new Polynomial([1, 1]);
      const b = new Polynomial([1, -1]);

      expect(a.plus(b).coefficients).toEqual(b.plus(a).coefficients);
      expect(a.plus(b).coefficients).toEqual(getMap([[0, 2]]));
    });

    test('all zero', () => {
      const a = new Polynomial([1, 2, 0, 4]);
      const b = new Polynomial([-1, -2, 0, -4]);

      expect(a.plus(b).coefficients).toEqual(b.plus(a).coefficients);
      expect(a.plus(b).coefficients).toEqual(getMap([]));
    });

    test('negative values', () => {
      const a = new Polynomial([1, -2, 0, 0, 7]);
      const b = new Polynomial([0, -5, 0, -3, 0]);

      expect(a.plus(b).coefficients).toEqual(b.plus(a).coefficients);
      expect(a.plus(b).coefficients).toEqual(getMap([
        [0, 1],
        [1, -7],
        [3, -3],
        [4, 7],
      ]));
    });
  });
});
