import { PointArgs } from './types';
import { Point } from './point';
import { create, setProps } from '../../utils';
import Vec2 from '../../vec2';

const HANDLE_KEY: Record<'next' | 'prev', '_next' | '_prev'> = {
  next: '_next',
  prev: '_prev',
};

class Handle extends Point {
  readonly connector: SVGLineElement;
  private readonly anchor: Anchor;

  constructor(args: PointArgs & {anchor: Anchor}) {
    const { root, anchor } = args;
    super({ root });

    this.connector = this.createConnector();
    args.root.appendChild(this.connector);

    this.anchor = anchor;
  }

  createConnector() {
    return create('line');
  }

  setPosition(pos: Vec2) {
    super.setPosition(pos);
    this.update();
  }

  update() {
    super.update();
    setProps(this.connector, {
      x1: this.anchor.x,
      y1: this.anchor.y,
      x2: this.x,
      y2: this.y,
      stroke: 'black',
      strokeWidth: 5,
    });
  }
}

class Handles {
  private _prev: Handle | null;
  private _next: Handle | null;

  private root: SVGElement;
  private anchor: Anchor;
  private isMirrored: boolean;

  constructor(args: {anchor: Anchor, root: SVGElement}) {
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

class Anchor extends Point {
  protected _handles: Handles;

  constructor(args: PointArgs) {
    super(args);
    this._handles = new Handles({
      anchor: this,
      root: args.root,
    });
  }

  get handlePositions() {
    return {
      prev: this._handles.prevHandlePos,
      next: this._handles.nextHandlePos,
    };
  }
}

export { Handle, Anchor };
