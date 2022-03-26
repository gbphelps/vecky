import { fireEvent } from '@testing-library/dom';
import { getMouseEvent } from './mouseEventPolyfill';
import Vec2 from '../utils/vec2';
import { TContext } from '../types';

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

function escape() {
  fireEvent.keyUp(document, { key: 'Escape' });
}

function getPaths() {
  return Array.from(document.getElementsByTagName('path'));
}

function mouseDownPointAt(ctx: TContext, pos: Vec2) {
  const points = Array.from(ctx.root.querySelectorAll('g[data-type="point"]')).map((p) => p.getElementsByTagName('circle')[0]);

  const found = points.find((p) => {
    const { id } = p.dataset;
    if (!id) throw new Error('missing ID');

    const point = ctx.pointRegistry.get(id);
    if (!point) throw new Error('point not found');

    return pos.equals(point.pos);
  });

  if (!found) throw new Error(`No point found at (${pos.x},${pos.y})`);

  fireEvent(found, getMouseEvent('mousedown', {}));
}

function mouseUp() {
  fireEvent(document, getMouseEvent('mouseup', {}));
}

function mouseMove(ctx: TContext, pos: Vec2) {
  fireEvent(ctx.root, getMouseEvent('mousemove', {
    offsetX: pos.x,
    offsetY: pos.y,
  }));
}
export {
  drag, click, escape, mouseDownPointAt, mouseUp, mouseMove, getPaths,
};
