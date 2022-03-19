import { IHandle, IAnchor } from './types';
import Handle from './handle';
import Vec2 from '../../utils/vec2';
import Layer from '../layers/layer';
import Point from './point';
import Registry from '../registry';

const HANDLE_KEY: Record<'next' | 'prev', '_next' | '_prev'> = {
  next: '_next',
  prev: '_prev',
};

class Handles {
  private _prev: IHandle | null;
  private _next: IHandle | null;

  private layer: Layer;
  private anchor: IAnchor;
  private isMirrored: boolean;
  private pointRegistry: Registry<Point>;

  constructor(args: {anchor: IAnchor, layer: Layer, pointRegistry: Registry<Point>}) {
    const { anchor } = args;

    this.layer = args.layer;
    this.anchor = anchor;
    this._prev = null;
    this._next = null;
    this.isMirrored = true;
    this.pointRegistry = args.pointRegistry;
  }

  get prevHandlePos() {
    return this._prev?.pos;
  }

  get nextHandlePos() {
    return this._next?.pos;
  }

  reverse() {
    const store = this._prev;
    this._prev = this._next;
    this._next = store;
  }

  updateHandlesByOffset(offset: Vec2) {
    if (this._next) {
      this._next.setPosition(
        this._next.pos.plus(offset),
      );
    }
    if (this._prev) {
      this._prev.setPosition(
        this._prev.pos.plus(offset),
      );
    }
  }

  setHandlePos(handle: 'prev' | 'next', pos: Vec2) {
    const handleKey = HANDLE_KEY[handle];

    const h = this[handleKey] || new Handle({
      anchor: this.anchor,
      layer: this.layer,
      pointRegistry: this.pointRegistry,
    });

    h.setPosition(pos);
    this[handleKey] = h;

    if (!this.isMirrored) return;

    const otherKey = handle === 'prev' ? '_next' : '_prev';

    const h2 = this[otherKey] || new Handle({
      anchor: this.anchor,
      layer: this.layer,
      pointRegistry: this.pointRegistry,
    });

    const pos2 = pos
      .minus(this.anchor.pos)
      .times(-1)
      .plus(this.anchor.pos);

    h2.setPosition(pos2);
    this[otherKey] = h2;
  }

  destroy() {
    this._prev?.destroy();
    this._next?.destroy();
  }
}

export default Handles;
