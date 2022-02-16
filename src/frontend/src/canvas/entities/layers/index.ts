import { create } from '../../utils';

class Layer {
  drawLayer: SVGGElement;
  uxLayer: SVGGElement;

  constructor({ root }: {root: SVGSVGElement}) {
    this.drawLayer = create('g');
    this.uxLayer = create('g');
  }
}

export { Layer };
