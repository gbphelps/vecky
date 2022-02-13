import EventsInterface, {
  CustomDragEndEvent,
  CustomDragStartEvent,
  CustomDragEvent,
  CustomWheelEvent,
  CustomMouseMoveEvent,
} from '../constructedEvents/EventsInterface';
import ScreenManager from '../screenManager';
import MousePosition from '../mousePosition';

interface IToolArgs {
  screenManager: ScreenManager;
  mousePosition: MousePosition;
  root: SVGElement;
}

interface Tool {
  onMouseMove(e: CustomMouseMoveEvent): void
  onDragStart(e: CustomDragStartEvent): void
  onDrag(e: CustomDragEvent): void
  onDragEnd(e: CustomDragEndEvent): void
  onWheel(e: CustomWheelEvent): void
}

// eslint-disable-next-line no-redeclare
abstract class Tool {
  eventsInterface: EventsInterface;

  constructor({ screenManager, mousePosition, root }: IToolArgs) {
    this.eventsInterface = new EventsInterface({
      root,
      screenManager,
      mousePosition,
      onDragStartCallback: this.onDragStart,
      onDragEndCallback: this.onDragEnd,
      onDragCallback: this.onDrag,
      onMouseMoveCallback: this.onMouseMove,
      onWheelCallback: this.onWheel,
    });
  }

  onDestroy() {
    this.eventsInterface.destroy();
  }
}

export default Tool;
export type { IToolArgs };
