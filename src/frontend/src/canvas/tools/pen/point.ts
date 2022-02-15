import { setProps, create, DoubleLinkedList } from '../../utils';
import Vec2 from '../../vec2';
import Shape from './shape';

interface PointArgs {
    root: SVGElement;
}

const HANDLE_KEY: Record<'next' | 'prev', '_next' | '_prev'> = {
  next: '_next',
  prev: '_prev',
};

class Point {
  private _pos: Vec2;
  private element: SVGElement;

  isActive: boolean;

  constructor(args: PointArgs) {
    const { root } = args;

    this._pos = new Vec2();

    this.element = this.createElement();
    root.appendChild(this.element);

    this.isActive = true;
    this.setIsActive(true);
  }

  get pos() {
    return this._pos.clone();
  }

  get x() {
    return this._pos.x;
  }

  get y() {
    return this._pos.y;
  }

  setPosition(pos: Vec2) {
    this._pos = pos;
    this.update();
  }

  update() {
    setProps(this.element, { transform: `translate(${this._pos.x} ${this._pos.y})` });
  }

  setIsActive(value: boolean) {
    this.isActive = value;
    setProps(this.element, {
      style: {
        pointerEvents: value ? 'none' : 'auto',
      },
    });
  }

  createElement() {
    const g = create('g');
    const circle = create('circle', {
      cx: 0,
      cy: 0,
      r: '.5%',
    });

    g.appendChild(circle);
    return g;
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

class PointListItem extends Anchor implements DoubleLinkedList<Anchor> {
  next: this | null;
  prev: this | null;
  private _shape: Shape;
  root: SVGElement;

  constructor(args: PointArgs) {
    super(args);
    const { root } = args;
    this.root = root;
    this.next = null;
    this.prev = null;
    this._shape = new Shape({ head: this, root: args.root });
  }

  setHandle(handle: 'prev' | 'next', pos: Vec2) {
    this._handles.setHandlePos(handle, pos);
    this.updateShape();
  }

  setPosition(pos: Vec2) {
    super.setPosition(pos);
    this.updateShape();
  }

  updateShape = () => {
    this._shape.update();
  };

  get shape() {
    return this._shape;
  }

  set shape(shape: Shape) {
    this._shape.destroy();
    this._shape = shape;
  }

  setPrev(prev: this | null) {
    this.prev = prev;

    let nextShape = new Shape({ head: this, root: this.root });

    if (prev) {
      // eslint-disable-next-line no-param-reassign
      prev.next = this;
      nextShape = prev.shape;
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: PointListItem | null = this;

    while (node) {
      node.shape = nextShape;
      node = node.next;
    }
  }

  setNext(nxt: this | null) {
    this.next = nxt;
    if (!nxt) return;

    // eslint-disable-next-line no-param-reassign
    nxt.prev = this;

    let node: PointListItem | null = nxt;

    while (node) {
      node.shape = this.shape;
      node = node.next;
    }
  }
}

export { Point, PointListItem };
