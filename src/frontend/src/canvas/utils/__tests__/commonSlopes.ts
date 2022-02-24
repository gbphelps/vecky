import { commonTangents, commonNormals } from '../commonSlopes';
import Vec2 from '../vec2';

describe('Common Slopes', () => {
  const a = [
    new Vec2(50, 0),
    new Vec2(100, -100),
    new Vec2(100, 100),
    new Vec2(0, 0),
  ];

  const b = [
    new Vec2(200, 0),
    new Vec2(100, -200),
    new Vec2(100, 200),
    new Vec2(200, 100),
  ];

  test('Sanity check - commonTangents', () => {
    const ct = commonTangents(a, b);

    const serialized = ct.map((pair) => pair.map(({ x, y }) => ({
      x: x.toFixed(4),
      y: y.toFixed(4),
    })));

    expect(serialized).toEqual([
      [{ x: '71.8936', y: '-28.3561' }, { x: '146.4014', y: '-55.9995' }],
      [{ x: '20.0638', y: '17.1586' }, { x: '155.6432', y: '111.7618' }],
      [{ x: '70.6672', y: '20.1954' }, { x: '140.2282', y: '-51.7938' }],
      [{ x: '80.5403', y: '-24.4935' }, { x: '140.8690', y: '93.2993' }],
    ]);
  });

  test('Sanity check - commonNormals', () => {
    const ct = commonNormals(a, b);

    const serialized = ct.map((pair) => pair.map(({ x, y }) => ({
      x: x.toFixed(4),
      y: y.toFixed(4),
    })));

    expect(serialized).toEqual([[
      { x: '82.6810', y: '-8.6217' },
      { x: '125.6965', y: '-5.0976' },
    ]]);
  });
});
