import ScreenManager from './screenManager';
import Vec2 from './vec2';
import EventManager from './constructedEvents/EventManager';

class MousePosition {
  screenManager: ScreenManager;
  events: EventManager;
  root: SVGElement;

  pos: Vec2;
  delta: Vec2;
  prev: Vec2;
  rawPos: Vec2;

  constructor(args: { root: SVGElement, screenManager: ScreenManager }) {
    const { root, screenManager } = args;

    this.screenManager = screenManager;

    this.root = root;

    this.pos = new Vec2();
    this.delta = new Vec2();
    this.prev = new Vec2();
    this.rawPos = new Vec2();

    this.screenManager.subscribe(this.update);
    this.events = new EventManager(root);
    this.events.add('mousemove', this.onMouseMove);
  }

  onMouseMove = (e: MouseEvent) => {
    this.rawPos = new Vec2(e.offsetX, e.offsetY);
    this.update();
  };

  update = () => {
    const newPos = new Vec2(
      this.screenManager.left + this.rawPos.x * this.screenManager.scale,
      this.screenManager.top + this.rawPos.y * this.screenManager.scale,
    );

    this.delta = newPos.minus(this.pos);
    this.prev = this.pos;
    this.pos = newPos;
  };

  destroy = () => {
    this.events.destroy();
    this.screenManager.unsubscribe(this.update);
  };
}

export default MousePosition;
