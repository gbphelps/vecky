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
  test('Sanity check', () => {
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

    expect(document.getElementsByTagName('path')).toHaveLength(0);

    // add our first point
    fireEvent(ctx.root, getMouseEvent('mousemove', A));
    fireEvent(ctx.root, getMouseEvent('mousedown', {}));

    // we should have initialized a shape now
    const shapeIds = Object.keys(ctx.shapeRegistry.manifest);
    expect(shapeIds).toHaveLength(1);

    // there are no curves though, since there's only a single point
    expect(ctx.shapeRegistry.manifest[shapeIds[0]].pointCurves).toEqual([]);

    fireEvent(ctx.root, getMouseEvent('mousemove', B));

    fireEvent.mouseUp(ctx.root);

    fireEvent(ctx.root, getMouseEvent('mousemove', C));

    expect(document.getElementsByTagName('path')[0].getAttribute('d')).toEqual(
      'M 30 40 Q 80 90 -30 20',
    );
  });
});
