import { fireEvent } from '@testing-library/dom';
import { getMouseEvent } from './mouseEventPolyfill';
import Vec2 from '../utils/vec2';

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

export { drag, click };
