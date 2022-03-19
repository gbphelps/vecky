import Tool from '../tool';
import Shape from '../../entities/shape';
import Registry from '../../entities/registry';
import { CustomMouseMoveEvent, DehydratedEventState } from '../../events/EventsInterface';
import { create, setProps, unmount } from '../../utils/misc';
import closestPoint from '../../utils/closestPoint';
import Vec2 from '../../utils/vec2';
import ScreenManager from '../../screenManager';
import { range as getRange, getOverlap, BBox } from '../../utils/bezier';
import Polynomial from '../../utils/polynomial';
import GridManager from '../../gridManager';
import cubicLineIntercepts from '../../utils/cubicLineIntercepts';
import { TContext } from '../../types';

function distanceToBox(point: Vec2, box: BBox) {
  const { x, y } = point;

  const xDim = (box.x[0] <= x && x <= box.x[1])
    ? 0
    : Math.min(
      ...box.x.map((xValue) => (xValue - x)),
    );

  const yDim = box.y[0] <= y && y <= box.y[1]
    ? 0 :
    Math.min(
      ...box.y.map((yValue) => (yValue - y)),
    );

  return Math.sqrt(xDim ** 2 + yDim ** 2);
}

class PointFinder extends Tool {
  screenManager: ScreenManager;
  root: SVGSVGElement;
  shapeRegistry: Registry<Shape>;
  element: SVGCircleElement;
  gridManager: GridManager;
  snapGrid: boolean;
  snapCurves: boolean;

  constructor(args: TContext, dehydratedEventState: DehydratedEventState | null) {
    super(args, dehydratedEventState);

    this.snapGrid = true;
    this.snapCurves = true;
    // TODO IMPLEMENT ME add curve intersections and endpoints to this!

    this.gridManager = args.gridManager;
    this.screenManager = args.screenManager;
    this.root = args.root;
    this.shapeRegistry = args.shapeRegistry;
    this.element = create('circle', {
      cx: 0,
      cy: 0,
      r: '.5%',
      style: {
        fill: 'black',
        pointerEvents: 'none',
      },
    });
  }

  get maxCurveDistance() {
    return Math.sqrt(this.screenManager.height ** 2
    + this.screenManager.width ** 2) * 0.05;
  }

  get maxGridDistance() {
    return new Vec2(
      this.gridManager.x.unit / 2,
      this.gridManager.y.unit / 2,
    ).magnitude;
  }

  shouldSkipCurve(pos: Vec2, curve: {x: Polynomial, y: Polynomial}) {
    const right = this.screenManager.left + this.screenManager.width;
    const bottom = this.screenManager.top + this.screenManager.height;
    const { left, top } = this.screenManager;

    const xr = getRange(curve.x);
    const yr = getRange(curve.y);

    const curveBox = {
      x: xr,
      y: yr,
    };

    const screenBox: BBox = {
      x: [left, right],
      y: [top, bottom],
    };

    if (!getOverlap(curveBox, screenBox)) return true;

    if (distanceToBox(pos, curveBox) > this.maxGridDistance) {
      return true;
    }

    return false;
  }

  bestGridPos(pos: Vec2) {
    const rounded = this.gridManager.snapPosition(pos);
    return {
      point: rounded,
      distance: pos.distance(rounded),
    };
  }

  bestCurvePos(pos: Vec2) {
    let best = {
      point: new Vec2(),
      distance: Infinity,
      curve: {
        x: new Polynomial(),
        y: new Polynomial(),
      },
    };

    Object.values(this.shapeRegistry.manifest)
      .forEach((v) => {
        v.curves.forEach((c) => {
          if (this.shouldSkipCurve(pos, c)) {
            return;
          }

          const d = closestPoint({
            x: c.x,
            y: c.y,
            range: [0, 1],
            point: pos,
            iterations: 10,
            numSegments: 20,
          });

          if (best.distance < d.distance) return;
          best = {
            ...d,
            curve: c,
          };
        });
      });

    if (best.distance === Infinity) {
      return {
        point: best.point,
        distance: best.distance,
      };
    }

    return this.snapGrid ? this.partialGridSnap({
      projected: best.point,
      curve: best.curve,
      original: pos,
    }) : {
      point: best.point,
      distance: best.distance,
    };
  }

  partialGridSnap(args: {
    projected: Vec2,
    curve: {
      x: Polynomial,
      y: Polynomial,
    },
    original: Vec2
  }) {
    const { projected, original, curve } = args;

    const opts: Vec2[] = [];

    const xOpts = this.gridManager.x.getCell(projected.x);
    const yOpts = this.gridManager.y.getCell(projected.y);

    xOpts.forEach((x) => {
      opts.push(...cubicLineIntercepts(x, 'x', curve));
    });

    yOpts.forEach((y) => {
      opts.push(...cubicLineIntercepts(y, 'y', curve));
    });

    const p = opts.reduce((best, curr) => {
      const distance = curr.distance(original);
      if (distance > best.distance) return best;

      return {
        point: curr,
        distance,
      };
    }, { point: new Vec2(), distance: Infinity });

    return p;
  }

  onMouseMove(e: CustomMouseMoveEvent) {
    const opts: {point: Vec2, distance: number}[] = [];

    if (this.snapCurves) opts.push(this.bestCurvePos(e.pos));
    if (this.snapGrid) opts.push(this.bestGridPos(e.pos));

    const winner = opts.reduce((best, curr) => (best.distance < curr.distance ? best : curr));

    if (!this.snapGrid && winner.distance > this.maxCurveDistance) {
      // else if we're not allowing snap grid and distance is bad
      // given zoomed size of screen, surpress point finder
      unmount(this.element);
      return;
    }

    this.root.appendChild(this.element);

    setProps(this.element, {
      cx: winner.point.x,
      cy: winner.point.y,
    });
  }

  destroy() {
    const state = super.destroy();
    unmount(this.element);
    return state;
  }
}

export default PointFinder;
