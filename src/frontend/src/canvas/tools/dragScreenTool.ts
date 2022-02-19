import Tool, { IToolArgs } from './tool';
import { CustomDragEvent } from '../events/EventsInterface';
import ScreenManager from '../screenManager';
import MousePosition from '../mousePosition';

class DragScreenTool extends Tool {
  screenManager: ScreenManager;
  mousePosition: MousePosition;

  constructor(args: IToolArgs) {
    super(args);
    this.screenManager = args.screenManager;
    this.mousePosition = args.mousePosition;
  }

  onDrag(e: CustomDragEvent) {
    this.screenManager.move(e.dragDeltaVector.times(-1));
  }

  destroy() {}
}

export default DragScreenTool;