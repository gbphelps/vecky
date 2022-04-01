import ResizeObserver from 'resize-observer-polyfill';
import { setProps } from './utils/misc';
import Vec2 from './utils/vec2';
import PubSub, { Subscription } from './publishers/pubSub';

interface ScreenManagerEvent {
    scale: number,
    left: number,
    top: number,
    height: number,
    width: number,
}

class ScreenManager {
  scale: number;
  left: number;
  top: number;
  height: number;
  width: number;
  viewportHeight: number;
  viewportWidth: number;
  ro: ResizeObserver;
  observer: PubSub<ScreenManagerEvent>;
  isInitialized: boolean;

  constructor(svg: SVGSVGElement) {
    if (!svg.parentElement) throw new Error('No parent');

    this.scale = 1;

    this.left = 0;
    this.top = 0;

    this.height = 0;
    this.width = 0;

    this.viewportHeight = 0;
    this.viewportWidth = 0;

    this.isInitialized = false;

    this.observer = new PubSub(() => ({
      scale: this.scale,
      left: this.left,
      top: this.top,
      height: this.height,
      width: this.width,
    }));

    this.observer.subscribe(({
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

      if (!this.isInitialized) {
        this.left = -this.width / 2;
        this.top = -this.height / 2;
        this.isInitialized = true;
      }

      this.observer.publish();
    });

    this.ro.observe(svg.parentElement);
  }

  zoom(anchor: Vec2, amount: number) {
    this.left = anchor.x + (this.left - anchor.x) * amount;
    this.top = anchor.y + (this.top - anchor.y) * amount;
    this.scale *= amount;
    this.height *= amount;
    this.width *= amount;
    this.observer.publish();
  }

  move(delta: Vec2) {
    this.left += delta.x;
    this.top += delta.y;
    this.observer.publish();
  }

  destroy() {
    this.ro.disconnect();
  }

  subscribe(fn: Subscription<ScreenManagerEvent>) {
    this.observer.subscribe(fn);
  }

  unsubscribe(fn: Subscription<ScreenManagerEvent>) {
    this.observer.subscribe(fn);
  }
}

export default ScreenManager;
