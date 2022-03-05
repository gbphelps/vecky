import { IAnchor } from './types';
import Handles from './handles';
import Point from './point';
import Shape from '../shape';
import Vec2 from '../../utils/vec2';
import Layer from '../layers/layer';
import Registry from '../registry';

class Anchor extends Point implements IAnchor {
  protected _handles: Handles;
  private _shape: Shape;

  constructor(args: {
    shape: Shape,
    layer: Layer,
    pointRegistry: Registry<Point>
  }) {
    super(args);

    this._handles = new Handles({
      anchor: this,
      layer: args.layer,
      pointRegistry: args.pointRegistry,
    });

    this._shape = args.shape;
  }

  setHandle(type: 'next' | 'prev', pos: Vec2) {
    this._handles.setHandlePos(type, pos);
    this.update();
  }

  reverseHandles() {
    this._handles.reverse();
  }

  get handlePositions() {
    return {
      prev: this._handles.prevHandlePos,
      next: this._handles.nextHandlePos,
    };
  }

  getShape() {
    return this._shape;
  }

  setShape(shape: Shape) {
    this._shape = shape;
  }

  update() {
    super.update();
    this._shape.update();
  }

  isLastPoint() {
    return this === this._shape.lastPoint();
  }

  isFirstPoint() {
    return this === this._shape.firstPoint();
  }

  isEdge() {
    return this.isLastPoint() || this.isFirstPoint();
  }

  getIndex() {
    this._shape.getIndex(this);
  }

  destroy() {
    this._handles.destroy();
    super.destroy();
  }

  deleteFromShape() {
    this.destroy();
    this._shape.deletePoint(this);
  }
}

export default Anchor;
