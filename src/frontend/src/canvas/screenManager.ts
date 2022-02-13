import { setProps } from './utils';

class ScreenManager {
  scale: number;

  left: number;

  top: number;

  height: number;

  width: number;

  viewportHeight: number;

  viewportWidth: number;

  svg: SVGElement;

  constructor(svg: SVGElement) {
    this.scale = 1;

    this.left = 0;
    this.top = 0;

    this.height = 0;
    this.width = 0;

    this.viewportHeight = 0;
    this.viewportWidth = 0;

    this.svg = svg;

    const ro = new ResizeObserver(([entry]) => {
      const { height, width } = entry.contentRect;

      this.viewportHeight = height;
      this.viewportWidth = width;

      this.height = this.scale * this.viewportHeight;
      this.width = this.scale * this.viewportWidth;

      console.log(this.viewportWidth, this.viewportHeight);

      setProps(svg, { viewBox: `${this.left} ${this.top} ${this.width} ${this.height}` });
    });

    if (!svg.parentElement) throw new Error('No parent');
    ro.observe(svg.parentElement);
  }

  zoom(anchor: {x: number, y: number}, amount: number) {
    this.left = anchor.x + (this.left - anchor.x) * amount;
    this.top = anchor.y + (this.top - anchor.y) * amount;
    this.scale *= amount;
    this.height *= amount;
    this.width *= amount;

    setProps(this.svg, { viewBox: `${this.left} ${this.top} ${this.width} ${this.height}` });
  }
}

export default ScreenManager;
