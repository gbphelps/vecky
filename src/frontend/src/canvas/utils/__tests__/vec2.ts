import Vec2 from '../vec2';

describe('vec2', () => {
  test('magnitude', () => {
    const vec = new Vec2(3, 4);
    expect(vec.magnitude).toEqual(5);
  });

  test('distance', () => {
    const a = new Vec2(4, 6);
    const b = new Vec2(9, 18);
    expect(a.distance(b)).toEqual(13);
  });

  test('clone', () => {
    const a = new Vec2(3, 3);
    const b = a.clone();
    b.x = 100;

    expect(b.x).toEqual(100);
    expect(a.x).toEqual(3);
  });

  test('minus', () => {
    const a = new Vec2(3, 8);
    const b = new Vec2(5, 6);
    const c = a.minus(b);

    expect(a).toMatchObject({ x: 3, y: 8 });
    expect(b).toMatchObject({ x: 5, y: 6 });

    expect(c).toMatchObject({ x: -2, y: 2 });
  });

  test('plus', () => {
    const a = new Vec2(3, 8);
    const b = new Vec2(5, 6);
    const c = a.plus(b);

    expect(a).toMatchObject({ x: 3, y: 8 });
    expect(b).toMatchObject({ x: 5, y: 6 });

    expect(c).toMatchObject({ x: 8, y: 14 });
  });

  test('times', () => {
    const a = new Vec2(3, 8);
    const b = a.times(10);

    expect(a).toMatchObject({ x: 3, y: 8 });
    expect(b).toMatchObject({ x: 30, y: 80 });
  });
});
