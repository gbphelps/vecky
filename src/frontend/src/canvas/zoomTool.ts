import Tool from './tool';
import ScreenManager from './screenManager';
import MousePosition from './mousePosition';

const ZOOM_INC = 1.001;

class ZoomTool extends Tool {
  constructor(args: {
      root: SVGElement,
      screenManager: ScreenManager,
      mousePosition: MousePosition
    }) {
    super();
    const { root, screenManager, mousePosition } = args;

    this.addListener({
      element: root,
      type: 'wheel',
      callback: (e) => {
        e.preventDefault();
        const zoomAmount = ZOOM_INC ** e.deltaY;
        const anchor = { x: mousePosition.x, y: mousePosition.y };
        console.log(anchor);
        screenManager.zoom(anchor, zoomAmount);
      },
    });
  }
}

export default ZoomTool;
