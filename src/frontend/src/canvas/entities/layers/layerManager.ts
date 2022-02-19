import Layer from './layer';

class LayerManager {
  activeLayer: Layer;
  baseLayer: Layer;

  constructor({ root }: {root: SVGSVGElement}) {
    this.baseLayer = new Layer({ root });
    this.activeLayer = new Layer({ root });
  }
}

export default LayerManager;
