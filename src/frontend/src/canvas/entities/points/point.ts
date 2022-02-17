import { setProps, create } from '../../utils';
import Vec2 from '../../vec2';
import { PointArgs } from './types';
import DomEntry from '../domEntry';
import Layer from '../layers/layer';

function assignAll(element: SVGElement, props: Record<string, string | string>) {
  Object.assign(element.dataset, props);
  let node: SVGElement | null = (element.firstElementChild as SVGElement | null);

  while (node) {
    assignAll(node, props);
    node = (node.nextElementSibling as SVGElement | null);
  }
}

class DomPoint {
  private hitbox: SVGCircleElement;
  private element: SVGGElement;
  private root: SVGSVGElement;
  private layer: Layer;

  constructor({ root, id, layer }: PointArgs & {id: string}) {
    this.root = root;
    this.layer = layer;

    const g = create('g');

    const circle = create('circle', {
      cx: 0,
      cy: 0,
      r: '.5%',
    });

    this.hitbox = create('circle', {
      cx: 0,
      cy: 0,
      r: '1.5%',
      style: {
        fillOpacity: '.2',
        fill: 'red',
      },
    });

    g.append(this.hitbox);
    g.appendChild(circle);
    layer.uxLayer.appendChild(g);
    this.element = g;

    assignAll(g, { id, type: 'point' });
    this.setIsCommitted(false);
  }

  setIsCommitted(isCommitted: boolean) {
    setProps(this.element, {
      style: {
        pointerEvents: isCommitted ? 'auto' : 'none',
      },
    });

    setProps(this.hitbox, {
      style: {
        fill: isCommitted ? 'blue' : 'red',
      },
    });
  }

  setPosition(pos: Vec2) {
    setProps(this.element, { transform: `translate(${pos.x} ${pos.y})` });
  }

  destroy() {
    this.layer.uxLayer.removeChild(this.element);
  }
}

class Point extends DomEntry {
  private _pos: Vec2;
  private domPoint: DomPoint;

  constructor(args: PointArgs) {
    super(args);

    const { root } = args;
    this._pos = new Vec2();
    this.domPoint = new DomPoint({ root, id: this.id, layer: args.layer });
  }

  protected update() {
    this.domPoint.setPosition(this._pos);
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

  commit() {
    this.domPoint.setIsCommitted(true);
  }

  uncommit() {
    this.domPoint.setIsCommitted(false);
  }

  destroy() {
    this.domPoint.destroy();
  }
}

export default Point;
