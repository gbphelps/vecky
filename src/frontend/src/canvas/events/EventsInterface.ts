import { IListener } from './types';
import ScreenManager from '../screenManager';
import MousePosition from '../mousePosition';
import Vec2 from '../vec2';
import EventManager from './EventManager';
import DomEntry from '../entities/domEntry';

interface CustomDragStartEvent {
  dragStart: Vec2,
  element: SVGElement
}
interface CustomWheelEvent {
    pos: Vec2,
    wheelVec: Vec2
}

interface CustomDragEndEvent {
  dragStart: Vec2,
  dragEnd: Vec2,
  dragVector: Vec2,
  element: SVGElement,
}

interface CustomDragEvent {
  dragStart: Vec2,
  dragVector: Vec2,
  dragDeltaVector: Vec2,
  pos: Vec2,
  element: SVGElement,
}

interface CustomMouseMoveEvent {
    pos: Vec2,
    delta: Vec2,
    prev: Vec2
}

interface CustomMouseDownEvent {
  element: DomEntry | null,
  pos: Vec2
}

interface CustomMouseUpEvent {
  pos: Vec2
}

type OnDragEndCallback = (args: CustomDragEndEvent) => void;
type OnDragCallback = (args: CustomDragEvent) => void;
type OnMouseMoveCallback = (args: CustomMouseMoveEvent) => void;
type OnWheelCallback = (ev: CustomWheelEvent) => void;
type OnDragStartCallback = (args: CustomDragStartEvent) => void;
type OnMouseDownCallback = (args: CustomMouseDownEvent) => void;
type OnMouseUpCallback = (args: CustomMouseUpEvent) => void;

type Args = {
    root: SVGElement;
    onDragStartCallback?: OnDragStartCallback;
    onDragEndCallback?: OnDragEndCallback;
    onDragCallback?: OnDragCallback;
    onMouseMoveCallback?: OnMouseMoveCallback;
    onWheelCallback?: OnWheelCallback;
    onMouseDownCallback?: OnMouseDownCallback;
    onMouseUpCallback?: OnMouseUpCallback;
    screenManager: ScreenManager;
    mousePosition: MousePosition;
}

class DragEventsInterface implements IListener {
  rootElement: SVGElement;
  selectedElement: SVGElement | null;

  onDragStartCallback?: OnDragStartCallback;
  onDragEndCallback?: OnDragEndCallback;
  onDragCallback?: OnDragCallback;
  onMouseMoveCallback?: OnMouseMoveCallback;
  onWheelCallback?: OnWheelCallback;
  onMouseDownCallback?: OnMouseDownCallback;
  onMouseUpCallback?: OnMouseUpCallback;

  screenManager: ScreenManager;
  mousePosition: MousePosition;

  dragStartVector: Vec2 | null;
  dragVector: Vec2 | null;
  wasDragged: boolean;
  rootEvents: EventManager;
  docEvents: EventManager;

  constructor(args: Args) {
    const {
      onMouseMoveCallback,
      onDragStartCallback,
      onDragEndCallback,
      onDragCallback,
      onWheelCallback,
      onMouseDownCallback,
      onMouseUpCallback,
      screenManager,
      mousePosition,
      root,
    } = args;

    this.screenManager = screenManager;
    this.mousePosition = mousePosition;

    this.dragVector = null;
    this.dragStartVector = null;

    this.rootElement = root;
    this.onDragStartCallback = onDragStartCallback;
    this.onDragEndCallback = onDragEndCallback;
    this.onDragCallback = onDragCallback;
    this.onMouseMoveCallback = onMouseMoveCallback;
    this.onWheelCallback = onWheelCallback;
    this.onMouseDownCallback = onMouseDownCallback;
    this.onMouseUpCallback = onMouseUpCallback;

    this.selectedElement = null;

    this.wasDragged = false;

    this.rootEvents = new EventManager(root);
    this.docEvents = new EventManager(document);

    if (onWheelCallback) this.rootEvents.add('wheel', this.onWheel);
    this.rootEvents.add('mousedown', this.mouseDown);

    // note: this MUST come after the mousedown event.
    if (onMouseMoveCallback) this.rootEvents.add('mousemove', this.onMouseMove);
  }

  mouseDown = (e: MouseEvent) => {
    const elementId = (e.target as SVGElement | null)?.dataset?.id ?? '';
    if (this.onMouseDownCallback) {
      this.onMouseDownCallback({
        pos: this.mousePosition.pos,
        element: DomEntry.lookup(this.rootElement, elementId),
      });
    }

    this.selectedElement = e.target as SVGElement;

    this.docEvents.add('mousemove', this.onDragStart, { once: true });
    this.docEvents.add('mousemove', this.onDrag);
    this.docEvents.add('mouseup', this.onMouseUp, { once: true });
  };

  onWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (!this.onWheelCallback) return;

    this.onWheelCallback({
      wheelVec: new Vec2(e.deltaX, e.deltaY),
      pos: this.mousePosition.pos,
    });
  };

  onDragStart = () => {
    if (!this.selectedElement) throw new Error();

    this.wasDragged = true;
    this.dragStartVector = this.mousePosition.pos;

    if (!this.onDragStartCallback) return;

    this.onDragStartCallback({
      dragStart: this.dragStartVector,
      element: this.selectedElement,
    });
  };

  onMouseUp = () => {
    if (
      this.dragStartVector
      && this.dragVector
      && this.selectedElement
      && this.wasDragged
      && this.onDragEndCallback
    ) {
      this.onDragEndCallback({
        dragStart: this.dragStartVector,
        dragVector: this.dragVector,
        dragEnd: this.mousePosition.pos,
        element: this.selectedElement,
      });
    }

    if (this.onMouseUpCallback) {
      this.onMouseUpCallback({
        pos: this.mousePosition.pos,
      });
    }

    this.selectedElement = null;
    this.wasDragged = false;
    this.dragStartVector = null;
    this.dragVector = null;
    this.docEvents.destroy();
  };

  onMouseMove = () => {
    if (this.wasDragged) return;
    if (!this.onMouseMoveCallback) return;

    this.onMouseMoveCallback({
      pos: this.mousePosition.pos,
      delta: this.mousePosition.delta,
      prev: this.mousePosition.prev,
    });
  };

  onDrag = () => {
    if (!this.dragStartVector) throw new Error('dragStartVector missing!');
    if (!this.selectedElement) throw new Error();

    this.dragVector = this.mousePosition.pos.minus(this.dragStartVector);

    if (!this.onDragCallback) return;

    this.onDragCallback({
      dragStart: this.dragStartVector,
      dragVector: this.dragVector,
      dragDeltaVector: this.mousePosition.delta,
      element: this.selectedElement,
      pos: this.mousePosition.pos,
    });
  };

  destroy = () => {
    this.rootEvents.destroy();
    this.docEvents.destroy();
  };
}

export default DragEventsInterface;

export type {
  OnDragStartCallback,
  OnDragEndCallback,
  OnDragCallback,
  OnMouseMoveCallback,
  OnWheelCallback,

  CustomWheelEvent,
  CustomDragEndEvent,
  CustomDragEvent,
  CustomDragStartEvent,
  CustomMouseMoveEvent,
  CustomMouseDownEvent,
  CustomMouseUpEvent,
};
