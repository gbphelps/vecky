import { CustomWheelEvent } from './constructedEvents/EventsInterface';
import ScreenManager from './screenManager';
import Tool, { IToolArgs } from './tool';

const ZOOM_INC = 1.001;

class ZoomTool extends Tool {
  screenManager: ScreenManager;

  constructor(args: IToolArgs) {
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
