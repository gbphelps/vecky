import { setProps } from './utils';
import Vec2 from './vec2';
import PubSub from './pubSub';

interface SubArgs {
    scale: number,
    left: number,
    top: number,
    height: number,
    width: number,
}

class ScreenManager extends PubSub<SubArgs> {
  scale: number;
  left: number;
  top: number;
  height: number;
  width: number;
  viewportHeight: number;
  viewportWidth: number;
  svg: SVGElement;
  ro: ResizeObserver;

  constructor(svg: SVGElement) {
    super();

    if (!svg.parentElement) throw new Error('No parent');

    this.scale = 1;

    this.left = 0;
    this.top = 0;

    this.height = 0;
    this.width = 0;

    this.viewportHeight = 0;
    this.viewportWidth = 0;

    this.svg = svg;

    this.ro = new ResizeObserver(([entry]) => {
      const { height, width } = entry.contentRect;

      this.viewportHeight = height;
      this.viewportWidth = width;

      this.height = this.scale * this.viewportHeight;
      this.width = this.scale * this.viewportWidth;

      this.update();
    });

    this.ro.observe(svg.parentElement);
  }

  zoom(anchor: Vec2, amount: number) {
    this.left = anchor.x + (this.left - anchor.x) * amount;
    this.top = anchor.y + (this.top - anchor.y) * amount;
    this.scale *= amount;
    this.height *= amount;
    this.width *= amount;
    this.update();
  }

  move(delta: Vec2) {
    this.left += delta.x;
    this.top += delta.y;
    this.update();
  }

  update = () => {
    this.publish();
    setProps(this.svg, { viewBox: `${this.left} ${this.top} ${this.width} ${this.height}` });
  };

  publish() {
    return {
      scale: this.scale,
      left: this.left,
      top: this.top,
      height: this.height,
      width: this.width,
    };
  }

  destroy() {
    this.ro.disconnect();
  }
}

export default ScreenManager;
