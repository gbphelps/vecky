import EventsInterface, {
  CustomDragEndEvent,
  CustomDragStartEvent,
  CustomDragEvent,
  CustomWheelEvent,
  CustomMouseMoveEvent,
  CustomMouseDownEvent,
  CustomMouseUpEvent,
  CustomEscapeEvent,
} from '../events/EventsInterface';
import ScreenManager from '../screenManager';
import MousePosition from '../mousePosition';
import Point from '../entities/points/point';
import Registry from '../entities/registry';

interface IToolArgs {
  screenManager: ScreenManager;
  mousePosition: MousePosition;
  root: SVGSVGElement;
  pointRegistry: Registry<Point>
}

interface Tool {
  onMouseMove(e: CustomMouseMoveEvent): void
  onDragStart(e: CustomDragStartEvent): void
  onDrag(e: CustomDragEvent): void
  onDragEnd(e: CustomDragEndEvent): void
  onWheel(e: CustomWheelEvent): void
  onMouseDown(e: CustomMouseDownEvent): void
  onMouseUp(e: CustomMouseUpEvent): void
  onEscape(e: CustomEscapeEvent): void
}

// eslint-disable-next-line no-redeclare
abstract class Tool {
  eventsInterface: EventsInterface;

  constructor({
    screenManager,
    mousePosition,
    root,
    pointRegistry,
  }: IToolArgs) {
    this.eventsInterface = new EventsInterface({
      pointRegistry,
      root,
      screenManager,
      mousePosition,
      onDragStartCallback: this.onDragStart?.bind(this),
      onDragEndCallback: this.onDragEnd?.bind(this),
      onDragCallback: this.onDrag?.bind(this),
      onMouseMoveCallback: this.onMouseMove?.bind(this),
      onWheelCallback: this.onWheel?.bind(this),
      onMouseDownCallback: this.onMouseDown?.bind(this),
      onMouseUpCallback: this.onMouseUp?.bind(this),
      onEscapeCallback: this.onEscape?.bind(this),
    });
  }

  destroy() {
    this.eventsInterface.destroy();
  }
}

export default Tool;
export type { IToolArgs };
