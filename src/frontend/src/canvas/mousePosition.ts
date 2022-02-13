import ScreenManager from './screenManager';
import Tool from './tool';

class MousePosition extends Tool {
  screenManager: ScreenManager;

  x: number;

  y: number;

  delX: number;

  delY: number;

  prevX: number;

  prevY: number;

  constructor(args: { root: SVGElement, screenManager: ScreenManager }) {
    super();

    const { root, screenManager } = args;

    this.screenManager = screenManager;

    this.delX = 0;
    this.delY = 0;

    this.prevX = 0;
    this.prevY = 0;

    this.x = 0;
    this.y = 0;

    this.addListener({
      element: root,
      type: 'mousemove',
      callback: this.onMouseMove.bind(this),
    });
  }

  onMouseMove(e: MouseEvent) {
    const { x, y } = e;

    this.prevX = this.x;
    this.prevY = this.y;

    this.x = this.screenManager.left + x * this.screenManager.scale;
    this.y = this.screenManager.top + y * this.screenManager.scale;

    this.delX = this.x - this.prevX;
    this.delY = this.x - this.prevY;
  }
}

export default MousePosition;
