import { setProps, create } from '../../utils';
import Vec2 from '../../vec2';
import { PointArgs } from './types';

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

  private createElement() {
    const g = create('g');
    const circle = create('circle', {
      cx: 0,
      cy: 0,
      r: '.5%',
    });

    g.appendChild(circle);
    return g;
  }

  protected update() {
    setProps(this.element, { transform: `translate(${this._pos.x} ${this._pos.y})` });
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

  setIsActive(value: boolean) {
    this.isActive = value;
    setProps(this.element, {
      style: {
        pointerEvents: value ? 'none' : 'auto',
      },
    });
  }
}

export default Point;
