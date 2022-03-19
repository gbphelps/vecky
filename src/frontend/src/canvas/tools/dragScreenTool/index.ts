import Tool from '../tool';
import { CustomDragEvent } from '../../events/EventsInterface';
import ScreenManager from '../../screenManager';
import MousePosition from '../../mousePosition';
import { TContext } from '../../types';

class DragScreenTool extends Tool {
  screenManager: ScreenManager;
  mousePosition: MousePosition;

  constructor(ctx: TContext) {
    super(ctx);
    this.screenManager = ctx.screenManager;
    this.mousePosition = ctx.mousePosition;
  }

  onDrag(e: CustomDragEvent) {
    this.screenManager.move(e.dragDeltaVector.times(-1));
  }
}

export default DragScreenTool;
