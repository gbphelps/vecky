import Polynomial from '../polynomial';

function getMap<A, B>(arr: [A, B][]): Map<A, B> {
  const map: Map<A, B> = new Map();
  for (let i = 0; i < arr.length; i++) map.set(arr[i][0], arr[i][1]);
  return map;
}

describe('Polynomial', () => {
  describe('1dsolver', () => {
    test('circle in [x^2 + y^2 - R^2 = 0] format intersecting line', () => {
      // circle radius 5 at origin;
      // x^2 + y^2 - 25 = 0;
      const circle = new Polynomial({
        '0:0': -25, // -25
        '2:0': 1, // 1x^2
        '0:2': 1, // 1y^2
      }); // = 0

      const line = (t: number) => (4 / 3) * t;

      const solver = circle.get1dSolver(0, { 1: line }); // convert to dim 0 (x dim)

      // we set the other side of the circle to zero,
      // so the intersection will happen where the solver is zero
      expect(solver(3)).toEqual(0);
      expect(solver(-3)).toEqual(0);

      // just to prove that we're not randomly falsey here
      expect(solver(4)).not.toEqual(0);
    });

    test('circle in [x^2 + y^2 = R^2] format intersecting line', () => {
      // circle radius 5 at origin;
      // x^2 + y^2 - 25 = 0;
      const circle = new Polynomial({
        '0:0': 0, // 0
        '2:0': 1, // 1x^2
        '0:2': 1, // 1y^2
      }); // = 0

      const line = (t: number) => (3 / 4) * t;

      const solver = circle.get1dSolver(0, { 1: line }); // convert to dim 0 (x dim)

      // we set the other side of the circle to zero,
      // so the intersection will happen where the solver is zero
      expect(solver(4)).toEqual(25);
      expect(solver(-4)).toEqual(25);

      // just to prove that we're not randomly falsey here
      expect(solver(3)).not.toEqual(25);
    });

    test('eq1: 3xy + 4x + 2y + 7 = 0 | eq2: x = y - 4', () => {
      const curve = new Polynomial({
        '0:0': 7,
        '1:1': 3,
        '1:0': 4,
        '0:1': 2,
      });

      const line = (t: number) => t - 4;

      // note: we're converting into y,
      // see eq2 in test description
      const solver = curve.get1dSolver(
        1, // y
        { 0: line }, // x Subst: x = y - 4
      );

      // by substitution, we know
      // 3(y-4)y + 4(y-4) + 2y = -7 ==>
      // 3y^2 - 6y - 9 = 0 ==>
      // (3y + 3) * (y - 3) = 0
      // y = -1, 3

      // expect both roots to satisfy eq1
      expect(solver(-1)).toEqual(0);
      expect(solver(3)).toEqual(0);

      // expect any other value NOT to satisfy eq1
      expect(solver(2)).not.toEqual(0);
    });
  });

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
      expect(p.evaluate(3)).toEqual(34);
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
