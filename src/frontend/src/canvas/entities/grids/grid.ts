import ScreenManager from '../../screenManager';
import { create } from '../../utils';

class GridLine {
  value: number;
  axis: 'x' | 'y';
  element: SVGLineElement;
  root: SVGSVGElement;

  constructor({ value, axis, root }: {
      value: number,
      axis: 'x' | 'y',
      root: SVGSVGElement
   }) {
    this.root = root;
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
        stroke: 'blue',
        strokeOpacity: 0.5,
        strokeWidth: 1,
        vectorEffect: 'non-scaling-stroke',
      },
    });
    this.root.appendChild(element);
    return element;
  }

  destroy() {
    this.root.removeChild(this.element);
  }
}

class Grid {
  axis: 'x' | 'y';
  private readonly screenManager: ScreenManager;
  private readonly root: SVGSVGElement;
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
    },
  ) {
    const {
      axis, root, screenManager, unit, offset,
    } = args;
    this.axis = axis;
    this.root = root;
    this.screenManager = screenManager;
    this.unit = unit;
    this.offset = offset;
    this.gridLines = [];

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
        root: this.root,
        value: i,
        axis: this.axis,
      }));
    }

    for (let i = currHi; i <= hi; i += this.unit) {
      this.gridLines.push(new GridLine({
        root: this.root,
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
