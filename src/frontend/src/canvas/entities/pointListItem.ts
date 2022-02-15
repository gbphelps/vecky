import Anchor from './points/anchor';
import { DoubleLinkedList } from '../utils';
import Shape from '../tools/pen/shape';
import { PointArgs } from './points/types';
import Vec2 from '../vec2';

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

export { PointListItem };
