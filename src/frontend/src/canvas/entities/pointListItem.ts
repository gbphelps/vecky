import Anchor from './points/anchor';
import { DoubleLinkedList } from '../utils';
import Shape from '../tools/pen/shape';
import { PointArgs } from './points/types';
import Vec2 from '../vec2';
import Layer from './layers/layer';

class PointListItem extends Anchor implements DoubleLinkedList<Anchor> {
  next: this | null;
  prev: this | null;
  private _shape: Shape;
  root: SVGSVGElement;
  layer: Layer;

  constructor(args: PointArgs) {
    super(args);
    const { root } = args;
    this.root = root;
    this.next = null;
    this.prev = null;
    this.layer = args.layer;
    this._shape = new Shape({ head: this, root: args.root, layer: args.layer });
  }

  print() {
    const list = [];
    let node: any = this;
    while (node) {
      list.push(node);
      node = node.next;
    }
    return list;
  }

  reverseNode() {
    this._handles.reverse();
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
    if (!this.prev) this._shape.destroy();
    this._shape = shape;
  }

  setPrev(prev: this | null) {
    this.prev = prev;

    let nextShape = new Shape({ head: this, root: this.root, layer: this.layer });

    if (prev) {
      // eslint-disable-next-line no-param-reassign
      prev.next = this;
      nextShape = prev.shape;
    }

    if (this._shape !== nextShape) {
      this._shape.destroy();
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let node: PointListItem | null = this;
      while (node) {
        node.shape = nextShape;
        node = node.next;
      }
    }

    this.updateShape();
  }

  setNext(nxt: this | null) {
    this.next = nxt;
    if (!nxt) return;

    // eslint-disable-next-line no-param-reassign
    nxt.prev = this;

    if (this._shape !== nxt.shape) {
      nxt._shape.destroy();
      let node: PointListItem | null = nxt;
      while (node) {
        node.shape = this.shape;
        node = node.next;
      }
    }

    this.updateShape();
  }

  destroy() {
    this.prev?.setNext(null);
    this.next?.setPrev(null);
    this.updateShape();
    super.destroy();
  }
}

export { PointListItem };
