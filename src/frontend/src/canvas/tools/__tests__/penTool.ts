import { fireEvent } from '@testing-library/dom';
import ResizeObserver from 'resize-observer-polyfill';
import { getMouseEvent } from '../testUtils';

import initCanvas from '../../initCanvas';

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
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('Makes one linear curve', () => {
    const A = {
      offsetX: 30,
      offsetY: 40,
    };
    const B = {
      offsetX: 80,
      offsetY: 90,
    };

    const root = document.createElement('div');
    document.body.appendChild(root);
    const { ctx } = initCanvas(root);

    expect(document.getElementsByTagName('path')).toHaveLength(0);

    // add our first point
    fireEvent(ctx.root, getMouseEvent('mousemove', A));

    // click, don't drag
    fireEvent(ctx.root, getMouseEvent('mousedown', {}));
    fireEvent(ctx.root, getMouseEvent('mouseup', {}));

    fireEvent(ctx.root, getMouseEvent('mousemove', B));

    expect(document.getElementsByTagName('path')[0].getAttribute('d')).toEqual(
      'M 30 40 L 80 90',
    );
  });

  test('Makes one quadratic bezier curve', () => {
    const A = {
      offsetX: 30,
      offsetY: 40,
    };
    const B = {
      offsetX: 80,
      offsetY: 90,
    };
    const C = {
      offsetX: -30,
      offsetY: 20,
    };

    const root = document.createElement('div');
    document.body.appendChild(root);
    const { ctx } = initCanvas(root);

    // add our first point
    fireEvent(ctx.root, getMouseEvent('mousemove', A));
    fireEvent(ctx.root, getMouseEvent('mousedown', {}));

    // drag to B
    fireEvent(ctx.root, getMouseEvent('mousemove', B));
    fireEvent.mouseUp(ctx.root);

    fireEvent(ctx.root, getMouseEvent('mousemove', C));

    expect(document.getElementsByTagName('path')[0].getAttribute('d')).toEqual(
      'M 30 40 Q 80 90 -30 20',
    );
  });

  test('Makes one cubic bezier curve', () => {
    const A = {
      offsetX: 0,
      offsetY: 0,
    };
    const B = {
      offsetX: 0,
      offsetY: 100,
    };
    const C = {
      offsetX: 100,
      offsetY: 0,
    };
    const D = {
      offsetX: 100,
      offsetY: 100,
    };

    const root = document.createElement('div');
    document.body.appendChild(root);
    const { ctx } = initCanvas(root);

    // add our first point
    fireEvent(ctx.root, getMouseEvent('mousemove', A));
    fireEvent(ctx.root, getMouseEvent('mousedown', {}));

    // drag to B
    fireEvent(ctx.root, getMouseEvent('mousemove', B));
    fireEvent.mouseUp(ctx.root);

    fireEvent(ctx.root, getMouseEvent('mousemove', C));

    // drag to D
    fireEvent(ctx.root, getMouseEvent('mousedown', {}));
    fireEvent(ctx.root, getMouseEvent('mousemove', D));

    expect(document.getElementsByTagName('path')[0].getAttribute('d')).toEqual(
      'M 0 0 C 0 100 100 -100 100 0',
    );
  });
});
