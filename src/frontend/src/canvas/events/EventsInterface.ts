import { IListener } from './types';
import ScreenManager from '../screenManager';
import MousePosition from '../mousePosition';
import Vec2 from '../utils/vec2';
import EventManager from './EventManager';
import Point from '../entities/points/point';
import Shape from '../entities/shape';
import Registry from '../entities/registry';

interface CustomEscapeEvent {}

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
  element: Point | Shape | null,
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
type OnEscapeCallback = (args: CustomEscapeEvent) => void;

type Args = {
    root: SVGSVGElement;
    screenManager: ScreenManager;
    mousePosition: MousePosition;
    pointRegistry: Registry<Point>;

    onDragStartCallback?: OnDragStartCallback;
    onDragEndCallback?: OnDragEndCallback;
    onDragCallback?: OnDragCallback;
    onMouseMoveCallback?: OnMouseMoveCallback;
    onWheelCallback?: OnWheelCallback;
    onMouseDownCallback?: OnMouseDownCallback;
    onMouseUpCallback?: OnMouseUpCallback;
    onEscapeCallback?: OnEscapeCallback;
}

class EventsInterface implements IListener {
  rootElement: SVGSVGElement;
  selectedElement: SVGElement | null;

  onDragStartCallback?: OnDragStartCallback;
  onDragEndCallback?: OnDragEndCallback;
  onDragCallback?: OnDragCallback;
  onMouseMoveCallback?: OnMouseMoveCallback;
  onWheelCallback?: OnWheelCallback;
  onMouseDownCallback?: OnMouseDownCallback;
  onMouseUpCallback?: OnMouseUpCallback;
  onEscapeCallback?: OnEscapeCallback;

  screenManager: ScreenManager;
  mousePosition: MousePosition;
  pointRegistry: Registry<Point>;

  dragStartVector: Vec2 | null;
  dragVector: Vec2 | null;
  wasDragged: boolean;

  rootEvents: EventManager;
  docEvents: EventManager;
  keyEvents: EventManager;

  constructor(args: Args) {
    const {
      onMouseMoveCallback,
      onDragStartCallback,
      onDragEndCallback,
      onDragCallback,
      onWheelCallback,
      onMouseDownCallback,
      onMouseUpCallback,
      onEscapeCallback,
      screenManager,
      mousePosition,
      pointRegistry,
      root,
    } = args;

    this.screenManager = screenManager;
    this.mousePosition = mousePosition;
    this.pointRegistry = pointRegistry;

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
    this.onEscapeCallback = onEscapeCallback;

    this.selectedElement = null;

    this.wasDragged = false;

    this.rootEvents = new EventManager(root);
    this.docEvents = new EventManager(document);
    this.keyEvents = new EventManager(document);

    if (onWheelCallback) this.rootEvents.add('wheel', this.onWheel);
    this.rootEvents.add('mousedown', this.mouseDown);

    if (this.onEscapeCallback) {
      this.keyEvents.add('keyup', (e) => {
        if (e.key === 'Escape') this.onEscape();
      });
    }

    // note: this MUST come after the mousedown event.
    if (onMouseMoveCallback) this.rootEvents.add('mousemove', this.onMouseMove);
  }

  onEscape() {
    if (!this.onEscapeCallback) return;
    this.onEscapeCallback({});
  }

  mouseDown = (e: MouseEvent) => {
    const elementId = (e.target as SVGElement | null)?.dataset?.id ?? '';
    if (this.onMouseDownCallback) {
      this.onMouseDownCallback({
        pos: this.mousePosition.pos,
        element: this.pointRegistry.get(elementId),
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
    this.keyEvents.destroy();
  };
}

export default EventsInterface;

export type {
  CustomWheelEvent,
  CustomDragEndEvent,
  CustomDragEvent,
  CustomDragStartEvent,
  CustomMouseMoveEvent,
  CustomMouseDownEvent,
  CustomMouseUpEvent,
  CustomEscapeEvent,
};
