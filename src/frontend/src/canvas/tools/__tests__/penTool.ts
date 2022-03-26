import ResizeObserver from 'resize-observer-polyfill';

import Vec2 from '../../utils/vec2';
import initCanvas from '../../initCanvas';
import { TContext } from '../../types';
import {
  drag, click, escape, mouseDownPointAt, mouseUp, mouseMove, getPaths,
} from '../../testUtils/userInteractions';

// Need to imperatively trigger this ro event so we can initialize the screenManager
jest.mock('resize-observer-polyfill', () => class FakeResizeObserver {
  constructor(...args: ConstructorParameters<typeof ResizeObserver>) {
    const cb = args[0];

    // @ts-ignore
    cb([{
      contentRect: {
        height: 1000,
        width: 1000,
      },
    }]);
  }
  observe() {}
});

describe('Pen tool', () => {
  let ctx: TContext = null as any;

  beforeEach(() => {
    document.body.innerHTML = '';
    const root = document.createElement('div');
    document.body.appendChild(root);
    ctx = initCanvas(root).ctx;
  });

  describe('Drawing a single curve', () => {
    test('Makes one linear curve', () => {
      const A = new Vec2(30, 40);
      const B = new Vec2(80, 90);

      expect(getPaths()).toHaveLength(0);

      click(ctx.root, A);
      click(ctx.root, B);

      const paths = getPaths();
      expect(paths).toHaveLength(1);
      expect(paths[0].getAttribute('d')).toEqual(
        'M 30 40 L 80 90',
      );
    });

    test('Makes one quadratic bezier curve (drag first)', () => {
      const A = new Vec2(30, 40);
      const B = new Vec2(80, 90);
      const C = new Vec2(-30, 20);

      drag(ctx.root, A, B);
      click(ctx.root, C);

      const paths = getPaths();

      expect(paths).toHaveLength(1);
      expect(paths[0].getAttribute('d')).toEqual(
        'M 30 40 Q 80 90 -30 20',
      );
    });

    test('Makes one quadratic bezier curve (drag second)', () => {
      const A = new Vec2(30, 40);
      const B = new Vec2(80, 90);
      const C = new Vec2(-30, 20);

      click(ctx.root, A);
      drag(ctx.root, B, C);

      const paths = getPaths();

      expect(paths).toHaveLength(1);
      expect(paths[0].getAttribute('d')).toEqual(
        'M 30 40 Q 190 160 80 90',
      );
    });

    test('Makes one cubic bezier curve', () => {
      const A = new Vec2(0, 0);
      const B = new Vec2(0, 100);
      const C = new Vec2(100, 0);
      const D = new Vec2(100, 100);

      drag(ctx.root, A, B);
      drag(ctx.root, C, D);

      const paths = getPaths();

      expect(paths).toHaveLength(1);
      expect(paths[0].getAttribute('d')).toEqual(
        'M 0 0 C 0 100 100 -100 100 0',
      );
    });
  });

  describe('Chaining', () => {
    test('click drag click', () => {});
    test('drag click drag', () => {});
    test('click click click', () => {});
  });

  describe('Joining two curves', () => {
    const A1 = new Vec2(-50, 0);
    const A2 = new Vec2(-70, 0);
    const A3 = new Vec2(-50, 100);
    const A4 = new Vec2(-70, 100);

    const B1 = new Vec2(50, 0);
    const B2 = new Vec2(70, 0);
    const B3 = new Vec2(50, 100);
    const B4 = new Vec2(70, 100);

    const C1 = new Vec2(0, -20);
    const C2 = new Vec2(100, 20);

    beforeEach(() => {
      drag(ctx.root, A1, A2);
      drag(ctx.root, A4, A3);
      escape();

      drag(ctx.root, B1, B2);
      drag(ctx.root, B4, B3);
      escape();
    });

    test('There should initially be two curves', () => {
      expect(getPaths()).toHaveLength(2);
    });

    [{ point: A1, name: 'A1' }, { point: A4, name: 'A4' }].forEach((A) => {
      [{ point: B1, name: 'B1' }, { point: B4, name: 'B4' }].forEach((B) => {
        ['click', 'drag'].forEach((action1) => {
          ['click', 'drag'].forEach((action2) => {
            test(`Join ${A.name} with ${B.name}, ${action1} then ${action2}`, () => {
              mouseDownPointAt(ctx, A.point);
              if (action1 === 'drag') {
                mouseMove(ctx, C1);
              }
              mouseUp();

              mouseDownPointAt(ctx, B.point);
              if (action1 === 'drag') {
                mouseMove(ctx, C2);
              }
              mouseUp();

              const paths = getPaths();
              expect(paths).toHaveLength(1);
            });
          });
        });
      });
    });
  });

  // describe('closing a curve', () => {});
});
