import { CustomWheelEvent } from '../../events/EventsInterface';
import ScreenManager from '../../screenManager';
import Tool from '../tool';
import { TContext } from '../../types';

const ZOOM_INC = 1.001;

class ZoomTool extends Tool {
  screenManager: ScreenManager;

  constructor(args: TContext) {
    super(args);
    this.screenManager = args.screenManager;
  }

  onWheel(e: CustomWheelEvent) {
    const zoom = ZOOM_INC ** e.wheelVec.y;
    const anchor = e.pos;

    this.screenManager.zoom(anchor, zoom);
  }
}

export default ZoomTool;
