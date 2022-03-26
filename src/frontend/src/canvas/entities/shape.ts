import Anchor from './points/anchor';
import { create, setProps, unmount } from '../utils/misc';
import Vec2 from '../utils/vec2';
import Layer from './layers/layer';
import RegistryObject from './registryObject';
import Registry from './registry';
import Point from './points/point';
import { bezierOfDegree } from '../utils/bezier';
import IntersectionsRegistry from '../intersectionsRegistry';

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
  shapeRegistry: Registry<Shape>;
  intersectionsRegistry: IntersectionsRegistry;

  constructor(args: {
    shapeRegistry: Registry<Shape>,
    pointRegistry: Registry<Point>,
    layer: Layer,
    intersectionsRegistry: IntersectionsRegistry
  }) {
    super({ registry: args.shapeRegistry });
    this.layer = args.layer;
    this.shapeRegistry = args.shapeRegistry;
    this.intersectionsRegistry = args.intersectionsRegistry;

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

  get pointCurves() {
    const arr = [...this.points];
    if (this.isClosed) arr.push(this.points[0]);

    const res = [];

    for (let i = 1; i < arr.length; i++) {
      const p1 = arr[i - 1].pos;
      const p2 = arr[i - 1].handlePositions.next;
      const p3 = arr[i].handlePositions.prev;
      const p4 = arr[i].pos;

      const points: Vec2[] = [];
      [p1, p2, p3, p4].forEach((p) => {
        if (p) points.push(p);
      });
      res.push(points);
    }
    return res;
  }

  get curves() {
    return this.pointCurves.map((points) => {
      const makeBezier = bezierOfDegree(points.length);
      return {
        x: makeBezier(...points.map((p) => p.x)),
        y: makeBezier(...points.map((p) => p.y)),
      };
    });
  }

  get size() {
    return this.points.length;
  }

  getIndex(point: Anchor) {
    const idx = this.points.findIndex((p) => p === point);
    if (idx === -1) throw new Error('Point not found!');
    return idx;
  }

  nthPoint(i: number) {
    return this.points[i];
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
    setProps(this.element, { d: '' });

    if (!this.points.length) {
      return;
    }

    const d = [`M ${this.points[0].x} ${this.points[0].y}`];

    const pc = this.pointCurves;

    pc.forEach((points) => {
      const controlPoints = points.slice(1);
      if (controlPoints.length) {
        const command = COMMAND_LOOKUP[controlPoints.length];
        d.push(`${command} ${controlPoints.map((p) => `${p.x} ${p.y}`).join(' ')}`);
      }
    });

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

  merge(other: Shape, thisSide: 'next' | 'prev', otherSide: 'next' | 'prev') {
    if (other.size > this.size) {
      other.merge(this, otherSide, thisSide);
      return;
    }

    if (thisSide === 'next' && otherSide === 'next') {
      other.reverse();
      other.points.forEach((point) => {
        point.setShape(this);
        this.points.push(point);
      });
    } else if (thisSide === 'next' && otherSide === 'prev') {
      other.points.forEach((point) => {
        point.setShape(this);
        this.points.push(point);
      });
    } else if (thisSide === 'prev' && otherSide === 'next') {
      const points = [...other.points].reverse();
      points.forEach((point) => {
        point.setShape(this);
        this.points.unshift(point);
      });
    } else if (thisSide === 'prev' && otherSide === 'prev') {
      other.reverse();
      const points = [...other.points].reverse();
      points.forEach((point) => {
        point.setShape(this);
        this.points.unshift(point);
      });
    }
    other.destroy();
    this.update();
  }

  destroy() {
    [...this.points].forEach((p) => {
      if (p.getShape() !== this) return;
      p.destroy();
    });
    unmount(this.element);
    super.destroy();
  }
}

export default Shape;
