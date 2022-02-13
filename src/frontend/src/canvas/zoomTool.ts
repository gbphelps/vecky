import { CustomWheelEvent } from './constructedEvents/EventsInterface';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';
import Tool from './tool';

const ZOOM_INC = 1.001;

interface Args {
  screenManager: ScreenManager,
  mousePosition: MousePosition,
  root: SVGElement,
}

class ZoomTool extends Tool {
  screenManager: ScreenManager;

  constructor(args: Args) {
    super(args);

    this.screenManager = args.screenManager;
  }

  onWheelCallback(e: CustomWheelEvent) {
    const zoom = ZOOM_INC ** e.wheelVec.y;
    const anchor = e.pos;

    this.screenManager.zoom(anchor, zoom);
  }
}

export default ZoomTool;
