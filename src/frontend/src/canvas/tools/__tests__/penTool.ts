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

  describe('closing a curve', () => {
    test('forward orientation', () => {
      drag(ctx.root, new Vec2(-50, 0), new Vec2(-50, 50));
      drag(ctx.root, new Vec2(50, 0), new Vec2(50, -50));
      mouseDownPointAt(ctx, new Vec2(-50, 0));

      // shape is now closed
      expect(getPaths()[0].getAttribute('d')).toEqual(
        'M -50 0 C -50 50 50 50 50 0 C 50 -50 -50 -50 -50 0 Z',
      );

      // but we can still drag the last handle, which is still active
      mouseMove(ctx, new Vec2(-50, 25));
      mouseUp();

      expect(getPaths()[0].getAttribute('d')).toEqual(
        'M -50 0 C -50 25 50 50 50 0 C 50 -50 -50 -25 -50 0 Z',
      );
    });

    test('backward orientation', () => {
      drag(ctx.root, new Vec2(-50, 0), new Vec2(-50, 50));
      drag(ctx.root, new Vec2(50, 0), new Vec2(50, -50));
      escape();

      mouseDownPointAt(ctx, new Vec2(-50, 0));
      mouseUp();

      mouseDownPointAt(ctx, new Vec2(50, 0));
      expect(getPaths()[0].getAttribute('d')).toEqual(
        'M -50 0 C -50 50 50 50 50 0 C 50 -50 -50 -50 -50 0 Z',
      );

      mouseMove(ctx, new Vec2(0, 25));
      mouseUp();

      expect(getPaths()[0].getAttribute('d')).toEqual(
        'M -50 0 C -50 50 0 25 50 0 C 100 -25 -50 -50 -50 0 Z',
      );
    });
  });

  describe('Chaining', () => {
    test('click drag click', () => {
      click(ctx.root, new Vec2(0, 0));
      drag(ctx.root, new Vec2(100, 0), new Vec2(100, 100));
      click(ctx.root, new Vec2(200, 0));
      expect(getPaths()[0].getAttribute('d')).toEqual(
        'M 0 0 Q 100 -100 100 0 Q 100 100 200 0',
      );
    });

    test('drag click drag', () => {
      drag(ctx.root, new Vec2(0, 0), new Vec2(100, 0));
      click(ctx.root, new Vec2(0, 100));
      drag(ctx.root, new Vec2(0, 200), new Vec2(-100, 200));
      expect(getPaths()[0].getAttribute('d')).toEqual(
        'M 0 0 Q 100 0 0 100 Q 100 200 0 200',
      );
    });

    test('click click click', () => {
      click(ctx.root, new Vec2(0, 0));
      click(ctx.root, new Vec2(100, 100));
      click(ctx.root, new Vec2(200, 0));
      expect(getPaths()[0].getAttribute('d')).toEqual(
        'M 0 0 L 100 100 L 200 0',
      );
    });
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

    const expectedResults: Record<string, string> = {
      'A1,B1,click,click':
      'M 70 100 C 90 100 70 0 50 0 C 30 0 -30 0 -50 0 C -70 0 -90 100 -70 100',

      'A1,B1,click,drag':
      'M 70 100 C 90 100 70 0 50 0 C 30 0 -30 0 -50 0 C -70 0 -90 100 -70 100',

      'A1,B1,drag,click':
      'M 70 100 C 90 100 100 20 50 0 C 0 -20 0 -20 -50 0 C -100 20 -90 100 -70 100',

      'A1,B1,drag,drag':
      'M 70 100 C 90 100 100 20 50 0 C 0 -20 0 -20 -50 0 C -100 20 -90 100 -70 100',

      'A1,B4,click,click':
      'M 50 0 C 70 0 90 100 70 100 C 50 100 -30 0 -50 0 C -70 0 -90 100 -70 100',

      'A1,B4,click,drag':
      'M 50 0 C 70 0 90 100 70 100 C 50 100 -30 0 -50 0 C -70 0 -90 100 -70 100',

      'A1,B4,drag,click':
      'M 50 0 C 70 0 100 20 70 100 C 40 180 0 -20 -50 0 C -100 20 -90 100 -70 100',

      'A1,B4,drag,drag':
      'M 50 0 C 70 0 100 20 70 100 C 40 180 0 -20 -50 0 C -100 20 -90 100 -70 100',

      'A4,B1,click,click':
      'M -50 0 C -70 0 -90 100 -70 100 C -50 100 30 0 50 0 C 70 0 90 100 70 100',

      'A4,B1,click,drag':
      'M -50 0 C -70 0 -90 100 -70 100 C -50 100 30 0 50 0 C 70 0 90 100 70 100',

      'A4,B1,drag,click':
      'M -50 0 C -70 0 -140 220 -70 100 C 0 -20 0 -20 50 0 C 100 20 90 100 70 100',

      'A4,B1,drag,drag':
      'M -50 0 C -70 0 -140 220 -70 100 C 0 -20 0 -20 50 0 C 100 20 90 100 70 100',

      'A4,B4,click,click':
      'M -50 0 C -70 0 -90 100 -70 100 C -50 100 50 100 70 100 C 90 100 70 0 50 0',

      'A4,B4,click,drag':
      'M -50 0 C -70 0 -90 100 -70 100 C -50 100 50 100 70 100 C 90 100 70 0 50 0',

      'A4,B4,drag,click':
      'M -50 0 C -70 0 -140 220 -70 100 C 0 -20 40 180 70 100 C 100 20 70 0 50 0',

      'A4,B4,drag,drag':
      'M -50 0 C -70 0 -140 220 -70 100 C 0 -20 40 180 70 100 C 100 20 70 0 50 0',
    };

    /*
      NOTE 3/26/22 these are snapshots of an app state for which
      all permutations were manually tested in the UI and
      verified to be correct. I spot-checked a couple of these
      ('A1,B1,click,click' and 'A4,B1,drag,drag') to make sure the
      test utils produce the same results as the UI, and both tests
      were correct. Note however that this means there is a (small)
      possibility that other tests MAY contain false positives if
      the test utils do not perfectly simulate user actions.
    */

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
              expect(paths[0].getAttribute('d')).toEqual(
                expectedResults[`${A.name},${B.name},${action1},${action2}`],
              );
            });
          });
        });
      });
    });
  });
});
