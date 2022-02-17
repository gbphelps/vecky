import { IAnchor, PointArgs } from './types';
import Handles from './handles';
import Point from './point';

class Anchor extends Point implements IAnchor {
  protected _handles: Handles;

  constructor(args: PointArgs) {
    super(args);
    this._handles = new Handles({
      anchor: this,
      root: args.root,
      layer: args.layer,
    });
  }

  get handlePositions() {
    return {
      prev: this._handles.prevHandlePos,
      next: this._handles.nextHandlePos,
    };
  }
}

export default Anchor;
