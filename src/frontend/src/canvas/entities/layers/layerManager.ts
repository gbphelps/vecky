import Layer from './layer';

class LayerManager {
  activeLayer: Layer;

  constructor({ root }: {root: SVGSVGElement}) {
    this.activeLayer = new Layer({ root });
  }
}

export default LayerManager;
