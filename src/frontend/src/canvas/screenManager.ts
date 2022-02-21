import { setProps } from './utils/misc';
import Vec2 from './utils/vec2';
import Publisher from './publishers/publisher';

interface ScreenManagerEvent {
    scale: number,
    left: number,
    top: number,
    height: number,
    width: number,
}

class ScreenManager extends Publisher<ScreenManagerEvent> {
  scale: number;
  left: number;
  top: number;
  height: number;
  width: number;
  viewportHeight: number;
  viewportWidth: number;
  ro: ResizeObserver;

  constructor(svg: SVGSVGElement) {
    super();

    if (!svg.parentElement) throw new Error('No parent');

    this.scale = 1;

    this.left = 0;
    this.top = 0;

    this.height = 0;
    this.width = 0;

    this.viewportHeight = 0;
    this.viewportWidth = 0;

    this.subscribe(({
      left,
      top,
      height,
      width,
    }) => {
      setProps(svg, { viewBox: `${left} ${top} ${width} ${height}` });
    });

    this.ro = new ResizeObserver(([entry]) => {
      const { height, width } = entry.contentRect;

      this.viewportHeight = height;
      this.viewportWidth = width;

      this.height = this.scale * this.viewportHeight;
      this.width = this.scale * this.viewportWidth;

      this.publish();
    });

    this.ro.observe(svg.parentElement);
  }

  zoom(anchor: Vec2, amount: number) {
    this.left = anchor.x + (this.left - anchor.x) * amount;
    this.top = anchor.y + (this.top - anchor.y) * amount;
    this.scale *= amount;
    this.height *= amount;
    this.width *= amount;
    this.publish();
  }

  move(delta: Vec2) {
    this.left += delta.x;
    this.top += delta.y;
    this.publish();
  }

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
