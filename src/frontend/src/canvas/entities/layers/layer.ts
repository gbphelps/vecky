import { create } from '../../utils';

class Layer {
  drawLayer: SVGGElement;
  uxLayer: SVGGElement;

  constructor({ root }: {root: SVGSVGElement}) {
    this.drawLayer = create('g');
    this.uxLayer = create('g');

    root.appendChild(this.drawLayer);
    root.appendChild(this.uxLayer);
  }
}

export default Layer;
