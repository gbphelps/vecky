import EventsInterface, {
  CustomDragEndEvent,
  CustomDragStartEvent,
  CustomDragEvent,
  CustomWheelEvent,
  CustomMouseMoveEvent,
  CustomMouseDownEvent,
  CustomMouseUpEvent,
} from '../events/EventsInterface';
import ScreenManager from '../screenManager';
import MousePosition from '../mousePosition';

interface IToolArgs {
  screenManager: ScreenManager;
  mousePosition: MousePosition;
  root: SVGSVGElement;
}

interface Tool {
  onMouseMove(e: CustomMouseMoveEvent): void
  onDragStart(e: CustomDragStartEvent): void
  onDrag(e: CustomDragEvent): void
  onDragEnd(e: CustomDragEndEvent): void
  onWheel(e: CustomWheelEvent): void
  onMouseDown(e: CustomMouseDownEvent): void
  onMouseUp(e: CustomMouseUpEvent): void
}

// eslint-disable-next-line no-redeclare
abstract class Tool {
  abstract destroy(): void;

  eventsInterface: EventsInterface;

  constructor({ screenManager, mousePosition, root }: IToolArgs) {
    this.eventsInterface = new EventsInterface({
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
    });
  }

  onDestroy() {
    this.eventsInterface.destroy();
  }
}

export default Tool;
export type { IToolArgs };
