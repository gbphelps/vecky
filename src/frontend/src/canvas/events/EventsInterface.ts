import { IListener } from './types';
import ScreenManager from '../screenManager';
import MousePosition from '../mousePosition';
import Vec2 from '../utils/vec2';
import EventManager from './EventManager';
import Point from '../entities/points/point';
import Shape from '../entities/shape';
import Registry from '../entities/registry';
import InputStateManager from './InputStateManager';

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
    inputStateManager: InputStateManager;

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
  inputStateManager: InputStateManager;

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
      inputStateManager,
    } = args;

    this.screenManager = screenManager;
    this.mousePosition = mousePosition;
    this.pointRegistry = pointRegistry;
    this.inputStateManager = inputStateManager;

    this.rootElement = root;
    this.onDragStartCallback = onDragStartCallback;
    this.onDragEndCallback = onDragEndCallback;
    this.onDragCallback = onDragCallback;
    this.onMouseMoveCallback = onMouseMoveCallback;
    this.onWheelCallback = onWheelCallback;
    this.onMouseDownCallback = onMouseDownCallback;
    this.onMouseUpCallback = onMouseUpCallback;
    this.onEscapeCallback = onEscapeCallback;

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

    if (this.inputStateManager.mouseDownVector) this.setMouseDownEvents();
  }

  onEscape() {
    if (!this.onEscapeCallback) return;
    this.onEscapeCallback({});
  }

  mouseDown = (e: MouseEvent) => {
    this.inputStateManager.mouseDownVector = this.mousePosition.pos;

    const elementId = (e.target as SVGElement | null)?.dataset?.id ?? '';
    if (this.onMouseDownCallback) {
      this.onMouseDownCallback({
        pos: this.mousePosition.pos,
        element: this.pointRegistry.get(elementId),
      });
    }

    this.inputStateManager.selectedElement = e.target as SVGElement;

    this.setMouseDownEvents();
  };

  setMouseDownEvents() {
    this.docEvents.add('mousemove', this.onDragStart, { once: true });
    this.docEvents.add('mousemove', this.onDrag);
    this.docEvents.add('mouseup', this.onMouseUp, { once: true });
  }

  onWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (!this.onWheelCallback) return;

    this.onWheelCallback({
      wheelVec: new Vec2(e.deltaX, e.deltaY),
      pos: this.mousePosition.pos,
    });
  };

  onDragStart = () => {
    if (!this.inputStateManager.selectedElement) throw new Error();

    if (!this.inputStateManager.mouseDownVector) throw new Error();
    this.inputStateManager.dragStartVector = this.inputStateManager.mouseDownVector;

    if (!this.onDragStartCallback) return;

    this.onDragStartCallback({
      dragStart: this.inputStateManager.dragStartVector,
      element: this.inputStateManager.selectedElement,
    });
  };

  onMouseUp = () => {
    this.inputStateManager.mouseDownVector = null;

    if (
      this.inputStateManager.dragStartVector
      && this.inputStateManager.dragVector
      && this.inputStateManager.selectedElement
      && this.onDragEndCallback
    ) {
      this.onDragEndCallback({
        dragStart: this.inputStateManager.dragStartVector,
        dragVector: this.inputStateManager.dragVector,
        dragEnd: this.mousePosition.pos,
        element: this.inputStateManager.selectedElement,
      });
    }

    if (this.onMouseUpCallback) {
      this.onMouseUpCallback({
        pos: this.mousePosition.pos,
      });
    }

    this.inputStateManager.selectedElement = null;
    this.inputStateManager.dragStartVector = null;
    this.inputStateManager.dragVector = null;
    this.docEvents.destroy();
  };

  onMouseMove = () => {
    // if mouse is down, this is a drag event
    // fire drag event instead of mouse move event
    if (this.inputStateManager.mouseDownVector) return;
    if (!this.onMouseMoveCallback) return;

    this.onMouseMoveCallback({
      pos: this.mousePosition.pos,
      delta: this.mousePosition.delta,
      prev: this.mousePosition.prev,
    });
  };

  onDrag = () => {
    if (!this.inputStateManager.dragStartVector) throw new Error('dragStartVector missing!');
    if (!this.inputStateManager.selectedElement) throw new Error();

    this.inputStateManager.dragVector = this.mousePosition.pos.minus(
      this.inputStateManager.dragStartVector,
    );

    if (!this.onDragCallback) return;

    this.onDragCallback({
      dragStart: this.inputStateManager.dragStartVector,
      dragVector: this.inputStateManager.dragVector,
      dragDeltaVector: this.mousePosition.delta,
      element: this.inputStateManager.selectedElement,
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
