import { IHandle, IAnchor } from './types';
import Point from './point';
import { create, setProps, unmount } from '../../utils/misc';
import Vec2 from '../../utils/vec2';
import Layer from '../layers/layer';
import Registry from '../registry';

class Handle extends Point implements IHandle {
  private readonly connector: SVGLineElement;
  private readonly anchor: IAnchor;
  private layer: Layer;
  side: 'prev' | 'next';

  constructor(args: {
    anchor: IAnchor,
    pointRegistry: Registry<Point>,
    layer: Layer,
    side: 'prev' | 'next'
  }) {
    const {
      anchor, layer, pointRegistry, side,
    } = args;

    super({ pointRegistry, layer });

    this.connector = this.createConnector();
    layer.uxLayer.appendChild(this.connector);

    this.anchor = anchor;
    this.layer = layer;
    this.side = side;
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

  update() {
    super.update();
    setProps(this.connector, {
      x1: this.anchor.x,
      y1: this.anchor.y,
      x2: this.x,
      y2: this.y,
    });
    this.anchor.update();
  }

  receivePosition(pos: Vec2) {
    super.setPosition(pos);
  }

  setPosition(pos: Vec2) {
    this.anchor.setHandle(this.side, pos);
  }

  destroy() {
    super.destroy();
    unmount(this.connector);
  }
}

export default Handle;
