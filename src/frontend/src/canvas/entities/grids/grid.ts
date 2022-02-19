import ScreenManager from '../../screenManager';
import { create } from '../../utils';
import Layer from '../layers/layer';

class GridLine {
  value: number;
  axis: 'x' | 'y';
  element: SVGLineElement;
  layer: Layer;

  constructor({ value, axis, layer }: {
      value: number,
      axis: 'x' | 'y',
      layer: Layer
   }) {
    this.layer = layer;
    this.value = value;
    this.axis = axis;
    this.element = this.makeElement(value);
  }

  makeElement(i: number) {
    const element = create('line', {
      x1: this.axis === 'x' ? i : Number.MIN_SAFE_INTEGER,
      x2: this.axis === 'x' ? i : Number.MAX_SAFE_INTEGER,
      y1: this.axis === 'y' ? i : Number.MIN_SAFE_INTEGER,
      y2: this.axis === 'y' ? i : Number.MAX_SAFE_INTEGER,
      style: {
        pointerEvents: 'none',
        stroke: '#aaaaff',
        strokeWidth: 1,
        vectorEffect: 'non-scaling-stroke',
      },
    });
    this.layer.drawLayer.appendChild(element);
    return element;
  }

  destroy() {
    this.layer.drawLayer.removeChild(this.element);
  }
}

class Grid {
  axis: 'x' | 'y';
  private readonly screenManager: ScreenManager;
  private readonly layer: Layer;
  unit: number;
  offset: number;
  private gridLines: GridLine[];

  constructor(
    args: {
        unit: number,
        axis: 'x' | 'y',
        screenManager: ScreenManager,
        root: SVGSVGElement,
        offset: number,
        layer: Layer
    },
  ) {
    const {
      axis,
      layer,
      screenManager,
      unit,
      offset,
    } = args;
    this.axis = axis;
    this.screenManager = screenManager;
    this.unit = unit;
    this.offset = offset;
    this.gridLines = [];
    this.layer = layer;

    this.update();
    this.screenManager.subscribe(this.update);
  }

  prune(lo: number, hi: number) {
    while (
      this.gridLines.length
          && this.gridLines[0].value < lo
    ) this.gridLines.shift()?.destroy();

    while (
      this.gridLines.length
          && this.gridLines[this.gridLines.length - 1].value > hi
    ) this.gridLines.pop()?.destroy();
  }

  insert(lo: number, hi: number) {
    const currLo = this.gridLines.length
      ? this.gridLines[0].value - this.unit
      : hi;

    const currHi = this.gridLines.length
      ? this.gridLines[this.gridLines.length - 1].value + this.unit
      : lo;

    for (let i = currLo; i >= lo; i -= this.unit) {
      this.gridLines.unshift(new GridLine({
        layer: this.layer,
        value: i,
        axis: this.axis,
      }));
    }

    for (let i = currHi; i <= hi; i += this.unit) {
      this.gridLines.push(new GridLine({
        layer: this.layer,
        value: i,
        axis: this.axis,
      }));
    }
  }

  update = () => {
    const min = (this.axis === 'x'
      ? this.screenManager.left
      : this.screenManager.top);

    const max = min + (this.axis === 'x'
      ? this.screenManager.width
      : this.screenManager.height);

    const lo = Math.ceil((min - this.offset) / this.unit) * this.unit;
    const hi = Math.floor((max - this.offset) / this.unit) * this.unit;

    this.prune(lo, hi);
    this.insert(lo, hi);
  };

  destroy() {
    this.screenManager.unsubscribe(this.update);
  }
}

export default Grid;
