import { IHandle, IAnchor } from './types';
import Point from './point';
import { create, setProps } from '../../utils/misc';
import Vec2 from '../../utils/vec2';
import Layer from '../layers/layer';
import Registry from '../registry';

class Handle extends Point implements IHandle {
  private readonly connector: SVGLineElement;
  private readonly anchor: IAnchor;
  private layer: Layer;

  constructor(args: {
    anchor: IAnchor,
    pointRegistry: Registry<Point>,
    layer: Layer
  }) {
    const { anchor, layer, pointRegistry } = args;

    super({ pointRegistry, layer });

    this.connector = this.createConnector();
    layer.uxLayer.appendChild(this.connector);

    this.anchor = anchor;
    this.layer = layer;
  }

  private createConnector() {
    return create('line', {
      style: {
        pointerEvents: 'none',
        stroke: 'black',
        strokeWidth: 1,
        vectorEffect: 'non-scaling-stroke',
        strokeOpacity: 0.2,
      },
    });
  }

  protected update() {
    super.update();
    setProps(this.connector, {
      x1: this.anchor.x,
      y1: this.anchor.y,
      x2: this.x,
      y2: this.y,
    });
  }

  setPosition(pos: Vec2) {
    super.setPosition(pos);
    this.update();
  }

  destroy() {
    super.destroy();
    this.layer.uxLayer.removeChild(this.connector);
  }
}

export default Handle;
