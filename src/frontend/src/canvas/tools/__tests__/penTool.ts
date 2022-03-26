import { fireEvent } from '@testing-library/dom';
import ResizeObserver from 'resize-observer-polyfill';
import { getMouseEvent } from '../testUtils';
import Vec2 from '../../utils/vec2';
import initCanvas from '../../initCanvas';
import { TContext } from '../../types';

function drag(element: Element, from: Vec2, to: Vec2) {
  fireEvent(element, getMouseEvent('mousemove', {
    offsetX: from.x,
    offsetY: from.y,
  }));
  fireEvent(element, getMouseEvent('mousedown', {}));
  fireEvent(element, getMouseEvent('mousemove', {
    offsetX: to.x,
    offsetY: to.y,
  }));
  fireEvent(element, getMouseEvent('mouseup', {}));
}

function click(element: Element, at: Vec2) {
  fireEvent(element, getMouseEvent('mousemove', {
    offsetX: at.x,
    offsetY: at.y,
  }));
  fireEvent(element, getMouseEvent('mousedown', {}));
  fireEvent(element, getMouseEvent('mouseup', {}));
}

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

      expect(document.getElementsByTagName('path')).toHaveLength(0);

      click(ctx.root, A);
      click(ctx.root, B);

      const paths = document.getElementsByTagName('path');
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

      const paths = document.getElementsByTagName('path');

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

      const paths = document.getElementsByTagName('path');

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

      const paths = document.getElementsByTagName('path');

      expect(paths).toHaveLength(1);
      expect(paths[0].getAttribute('d')).toEqual(
        'M 0 0 C 0 100 100 -100 100 0',
      );
    });
  });

  // describe('Joining two curves', () => {
  //   const root = document.createElement('div');
  //   document.body.appendChild(root);
  //   const { ctx } = initCanvas(root);
  // });

  // describe('closing a curve', () => {});
});
