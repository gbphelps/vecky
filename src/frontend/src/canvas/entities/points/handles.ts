import { IHandle, IAnchor } from './types';
import Handle from './handle';
import Vec2 from '../../vec2';

const HANDLE_KEY: Record<'next' | 'prev', '_next' | '_prev'> = {
  next: '_next',
  prev: '_prev',
};

class Handles {
  private _prev: IHandle | null;
  private _next: IHandle | null;

  private root: SVGSVGElement;
  private anchor: IAnchor;
  private isMirrored: boolean;

  constructor(args: {anchor: IAnchor, root: SVGSVGElement}) {
    const { anchor, root } = args;

    this.anchor = anchor;
    this.root = root;
    this._prev = null;
    this._next = null;
    this.isMirrored = true;
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

  setHandlePos(handle: 'prev' | 'next', pos: Vec2) {
    const handleKey = HANDLE_KEY[handle];

    const h = this[handleKey] || new Handle({
      anchor: this.anchor,
      root: this.root,
    });

    h.setPosition(pos);
    this[handleKey] = h;

    if (!this.isMirrored) return;

    const otherKey = handle === 'prev' ? '_next' : '_prev';

    const h2 = this[otherKey] || new Handle({
      anchor: this.anchor,
      root: this.root,
    });

    const pos2 = pos
      .minus(this.anchor.pos)
      .times(-1)
      .plus(this.anchor.pos);

    h2.setPosition(pos2);
    this[otherKey] = h2;
  }
}

export default Handles;
