import Grid from './entities/grids/grid';
import Layer from './entities/layers/layer';
import ScreenManager from './screenManager';
import Vec2 from './utils/vec2';

class GridManager {
  x: Grid;
  y: Grid;

  constructor(args: {
      layer: Layer,
      screenManager: ScreenManager,
      root: SVGSVGElement
    }) {
    const { screenManager, layer, root } = args;

    this.x = new Grid({
      unit: 10,
      offset: 0,
      axis: 'y',
      root,
      screenManager,
      layer,
    });

    this.y = new Grid({
      unit: 10,
      offset: 0,
      axis: 'x',
      root,
      screenManager,
      layer,
    });
  }

  snapPosition(pos: Vec2) {
    return new Vec2(
      this.x.snapPosition(pos.x),
      this.y.snapPosition(pos.y),
    );
  }
}

export default GridManager;
