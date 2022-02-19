import Anchor from './points/anchor';
import { create, setProps } from '../utils';
import Vec2 from '../vec2';
import Layer from './layers/layer';
import RegistryObject from './registryObject';
import Registry from './registry';
import Point from './points/point';

const COMMAND_LOOKUP: Record<number, string> = {
  1: 'L',
  2: 'Q',
  3: 'C',
};

class Shape extends RegistryObject<Shape> {
  element: SVGPathElement;
  private points: Anchor[];
  layer: Layer;
  isClosed: boolean;
  pointRegistry: Registry<Point>;

  constructor(args: {
    shapeRegistry: Registry<Shape>,
    pointRegistry: Registry<Point>,
    layer: Layer
  }) {
    super({ registry: args.shapeRegistry });
    this.layer = args.layer;

    this.element = create('path', {
      style: {
        fill: 'none',
        stroke: 'black',
        strokeWidth: '1',
        vectorEffect: 'non-scaling-stroke',
      },
    });
    this.layer.drawLayer.appendChild(this.element);

    this.points = [];
    this.isClosed = false;
    this.pointRegistry = args.pointRegistry;
  }

  get size() {
    return this.points.length;
  }

  getIndex(point: Anchor) {
    const idx = this.points.findIndex((p) => p === point);
    if (idx === -1) throw new Error('Point not found!');
    return idx;
  }

  lastPoint() {
    return this.points[this.points.length - 1];
  }

  firstPoint() {
    return this.points[0];
  }

  makePoint(pos: Vec2) {
    const point = new Anchor({
      shape: this,
      layer: this.layer,
      pointRegistry: this.pointRegistry,
    });
    point.setPosition(pos);
    return point;
  }

  push(pos: Vec2) {
    const point = this.makePoint(pos);
    this.points.push(point);
  }

  unshift(pos: Vec2) {
    const point = this.makePoint(pos);
    this.points.unshift(point);
  }

  update() {
    if (!this.points.length) {
      setProps(this.element, { d: '' });
      return;
    }

    const d = [`M ${this.points[0].x} ${this.points[0].y}`];

    for (
      let i = 1;
      i < this.points.length + (this.isClosed ? 1 : 0);
      i++
    ) {
      const controlPoints: Vec2[] = [];

      const handle1 = this.points[i - 1].handlePositions.next;

      const handle2 = this.points[i % this.points.length].handlePositions.prev;

      const endpoint: Vec2 | undefined = this.points[i % this.points.length].pos;

      [handle1, handle2, endpoint].forEach((p) => {
        if (p) controlPoints.push(p);
      });

      if (controlPoints.length) {
        const command = COMMAND_LOOKUP[controlPoints.length];
        d.push(`${command} ${controlPoints.map((p) => `${p.x} ${p.y}`).join(' ')}`);
      }
    }

    setProps(this.element, { d: d.join(' ') });
  }

  close() {
    this.isClosed = true;
    this.update();
  }

  deletePoint(point: Anchor) {
    const index = this.getIndex(point);
    this.points.splice(index, 1);
    this.update();
  }

  reverse() {
    this.points.reverse();
    this.points.forEach((p) => p.reverseHandles());
  }
  // insert(idx: number, pos: Vec2) {}

  merge(other: Shape, side: 'back' | 'front', reverseThis: boolean) {
    if (reverseThis) this.reverse();

    if (other.size > this.size) {
      other.merge(this, side === 'back' ? 'front' : 'back', false);
      return;
    }

    other.destroy();

    other.points.forEach((p) => p.setShape(this));

    this.points = side === 'front'
      ? other.points.concat(this.points)
      : this.points.concat(other.points);
    this.update();
  }

  destroy() {
    super.destroy();
    this.layer.drawLayer.removeChild(this.element);
  }
}

export default Shape;