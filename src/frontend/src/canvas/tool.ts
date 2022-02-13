import EventsInterface, {
  CustomDragEndEvent,
  CustomDragStartEvent,
  CustomDragEvent,
  CustomWheelEvent,
  CustomMouseMoveEvent,
} from './constructedEvents/EventsInterface';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';

interface Args {
  screenManager: ScreenManager;
  mousePosition: MousePosition;
  root: SVGElement;
}

interface Tool {
  onMouseMove(e: CustomMouseMoveEvent): void
  onDragStartCallback(e: CustomDragStartEvent): void
  onDragCallback(e: CustomDragEvent): void
  onDragEndCallback(e: CustomDragEndEvent): void
  onWheelCallback(e: CustomWheelEvent): void
}

// eslint-disable-next-line no-redeclare
abstract class Tool {
  eventsInterface: EventsInterface;

  constructor({ screenManager, mousePosition, root }: Args) {
    this.eventsInterface = new EventsInterface({
      root,
      screenManager,
      mousePosition,
      onDragStartCallback: this.onDragStartCallback,
      onDragEndCallback: this.onDragEndCallback,
      onDragCallback: this.onDragCallback,
      onMouseMoveCallback: this.onMouseMove,
      onWheelCallback: this.onWheelCallback,
    });
  }

  onDestroy() {
    this.eventsInterface.destroy();
  }
}

export default Tool;
