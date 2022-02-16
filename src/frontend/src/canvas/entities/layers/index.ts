import { create } from '../../utils';

class Layer {
  drawLayer: SVGGElement;
  uxLayer: SVGGElement;

  constructor({ root }: {root: SVGElement}) {
    this.drawLayer = create('g');
    this.uxLayer = create('g');
  }
}

export { Layer };
