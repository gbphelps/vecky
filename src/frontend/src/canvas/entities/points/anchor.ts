import { IAnchor, PointArgs } from './types';
import Handles from './handles';
import Point from './point';
import { ShapeWithUI } from '../pointListItem';
import Vec2 from '../../vec2';

class Anchor extends Point implements IAnchor {
  protected _handles: Handles;
  private _shape: ShapeWithUI;

  constructor(args: PointArgs & {shape: ShapeWithUI}) {
    super(args);

    this._handles = new Handles({
      anchor: this,
      root: args.root,
      layer: args.layer,
    });

    this._shape = args.shape;
  }

  setHandle(type: 'next' | 'prev', pos: Vec2) {
    this._handles.setHandlePos(type, pos);
    this.update();
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

  setShape(shape: ShapeWithUI) {
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
    super.destroy();
    this._shape.deletePoint(this);
  }
}

export default Anchor;
