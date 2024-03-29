import { setProps, create, unmount } from '../../utils/misc';
import Vec2 from '../../utils/vec2';
import RegistryObject from '../registryObject';
import Registry from '../registry';
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
  private layer: Layer;

  constructor({ id, layer }: {id: string, layer: Layer}) {
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
    unmount(this.element);
  }
}

class Point extends RegistryObject<Point> {
  private _pos: Vec2;
  private domPoint: DomPoint;

  constructor(args: {pointRegistry: Registry<Point>, layer: Layer}) {
    super({ registry: args.pointRegistry });

    this._pos = new Vec2();
    this.domPoint = new DomPoint({ id: this.id, layer: args.layer });
  }

  update() {
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
    super.destroy();
    this.domPoint.destroy();
  }
}

export default Point;
