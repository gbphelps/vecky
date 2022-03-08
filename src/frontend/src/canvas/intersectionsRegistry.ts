import Vec2 from './utils/vec2';
import intersections from './utils/intersections';
import Shape from './entities/shape';
import Registry from './entities/registry';
import { bbox, bezier2d } from './utils/bezier';
import GridManager from './gridManager';
import cubicLineIntercepts from './utils/cubicLineIntercepts';
import { create } from './utils/misc';

function stringify(curve: Vec2[]) {
  return JSON.stringify(curve);
}

class IntersectionsRegistry {
  gridManager: GridManager;
  intersectionLookup: Record<string, Record<string, {ta: number, tb: number, point: Vec2}[]>>;
  gridXLookup: Record<string, {[key: number]: Vec2[]}>;
  gridYLookup: Record<string, {[key: number]: Vec2[]}>;
  shapeRegistry: Registry<Shape>;
  root: SVGSVGElement;
  debug: boolean;
  debugElement: SVGGElement;

  constructor(args: {
      shapeRegistry: Registry<Shape>,
      gridManager: GridManager,
      root: SVGSVGElement,
    }) {
    this.intersectionLookup = {};
    this.gridXLookup = {};
    this.gridYLookup = {};

    this.shapeRegistry = args.shapeRegistry;
    this.gridManager = args.gridManager;
    this.root = args.root;

    this.debug = true;
    this.debugElement = create('g');
    this.root.appendChild(this.debugElement);
  }

  updateDebugger() {
    if (!this.debug) return;

    const debugPoint = (p: Vec2) => create('circle', {
      r: '.5%',
      cx: p.x,
      cy: p.y,
      fill: 'red',
    });

    this.debugElement.innerHTML = '';

    Object.values(this.intersectionLookup).forEach((v) => {
      Object.values(v).forEach((points) => {
        points.forEach(({ point }) => this.debugElement.appendChild(debugPoint(point)));
      });
    });

    [this.gridXLookup, this.gridYLookup].forEach((gridLookup) => {
      Object.values(gridLookup).forEach((v) => {
        Object.values(v).forEach((points) => {
          points.forEach((point) => this.debugElement.appendChild(debugPoint(point)));
        });
      });
    });
  }

  addIntersections(c1: Vec2[], c2: Vec2[]) {
    const key1 = stringify(c1);
    const key2 = stringify(c2);

    if (key1 === key2) {
      // TODO IMPLEMENT ME!
      return;
    }

    if (this.intersectionLookup[key1]?.[key2]) return;

    const inx = intersections(c1, c2);
    if (!inx.length) return;

    this.intersectionLookup[key1] = this.intersectionLookup[key1] ?? {};
    this.intersectionLookup[key1][key2] = inx;

    this.intersectionLookup[key2] = this.intersectionLookup[key2] ?? {};
    this.intersectionLookup[key2][key1] = inx.map(({ point, ta, tb }) => ({
      point,
      ta: tb,
      tb: ta,
    }));

    this.updateDebugger();
  }

  addCurve(curve: Vec2[]) {
    this.addAllGridIntersections(curve);
    Object.values(this.shapeRegistry.manifest).forEach((shape) => {
      shape.pointCurves.forEach((c2) => {
        this.addIntersections(curve, c2);
      });
    });
  }

  removeCurve(curve: Vec2[]) {
    const selfKey = stringify(curve);
    const partners = Object.keys(this.intersectionLookup[selfKey] ?? {});

    delete this.intersectionLookup[selfKey];
    delete this.gridXLookup[selfKey];
    delete this.gridYLookup[selfKey];

    partners.forEach((partnerKey) => {
      delete this.intersectionLookup[partnerKey]?.[selfKey];
    });
    this.updateDebugger();
  }

  addAllGridIntersections(points: Vec2[]) {
    const bounds = bbox(points);
    const curve = bezier2d(points);
    const key = stringify(points);

    const xLo = this.gridManager.x.getCell(bounds.x[0])[1];
    const xHi = this.gridManager.x.getCell(bounds.x[1])[0];

    const yLo = this.gridManager.y.getCell(bounds.y[0])[1];
    const yHi = this.gridManager.y.getCell(bounds.y[1])[0];

    this.gridXLookup[key] = {};
    this.gridYLookup[key] = {};

    for (let i = xLo; i <= xHi; i += this.gridManager.x.unit) {
      const roots = cubicLineIntercepts(i, 'x', curve);
      this.gridXLookup[key][i] = roots;
    }

    for (let i = yLo; i <= yHi; i += this.gridManager.y.unit) {
      const roots = cubicLineIntercepts(i, 'y', curve);
      this.gridYLookup[key][i] = roots;
    }

    this.updateDebugger();
  }

  addShape(s: Shape) {
    s.pointCurves.forEach((c1) => {
      this.addAllGridIntersections(c1);

      const addIntersections = (c2: Vec2[]) => {
        this.addIntersections(c1, c2);
      };

      Object.values(this.shapeRegistry.manifest).forEach((shape) => {
        // TODO: while we want to calculate self-intersections, we
        // have to modify the algorithm, because technically there are
        // infinitely many self intersections where c(t) == c(s) && s == t
        // we want some way to check ONLY c(t) == c(s) && s != t. Divide
        // in half I guess?
        shape.pointCurves.forEach(addIntersections);
      });
    });
  }

  removeShape(s: Shape) {
    s.pointCurves.forEach((c) => {
      this.removeCurve(c);
    });
  }

  getIntersections(c1: Vec2[], c2: Vec2[]) {
    const k1 = stringify(c1);
    const k2 = stringify(c2);

    if (!this.intersectionLookup[k1]?.[k2]) this.addIntersections(c1, c2);

    return this.intersectionLookup[k1][k2];
  }
}

export default IntersectionsRegistry;
