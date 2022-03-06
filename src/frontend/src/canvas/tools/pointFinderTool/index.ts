import Tool, { IToolArgs } from '../tool';
import Shape from '../../entities/shape';
import Registry from '../../entities/registry';
import { CustomMouseMoveEvent } from '../../events/EventsInterface';
import { create, setProps, unmount } from '../../utils/misc';
import closestPoint from '../../utils/closestPoint';
import Vec2 from '../../utils/vec2';
import ScreenManager from '../../screenManager';
import { range as getRange, getOverlap } from '../../utils/bezier';
import Polynomial from '../../utils/polynomial';
import GridManager from '../../gridManager';

interface Args extends IToolArgs {
  shapeRegistry: Registry<Shape>;
  gridManager: GridManager;
}

class PointFinder extends Tool {
  screenManager: ScreenManager;
  root: SVGSVGElement;
  shapeRegistry: Registry<Shape>;
  element: SVGCircleElement;
  gridManager: GridManager;
  snapGrid: boolean;
  snapCurves: boolean;

  constructor(args:Args) {
    super(args);

    this.snapGrid = true;

    // TODO IMPLEMENT ME
    this.snapCurves = true;

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

  shouldSkip(pos: Vec2, curve: {x: Polynomial, y: Polynomial}) {
    const right = this.screenManager.left + this.screenManager.width;
    const bottom = this.screenManager.top + this.screenManager.height;
    const { left, top } = this.screenManager;

    const xr = getRange(curve.x);
    const yr = getRange(curve.y);

    if (!getOverlap({
      x: xr,
      y: yr,
    }, {
      x: [left, right],
      y: [top, bottom],
    })) return true;

    const xSide = (xr[0] <= pos.x && pos.x <= xr[1])
      ? 0
      : Math.min(
        ...xr.map((xValue) => (xValue - pos.x) ** 2),
      );

    const ySide = yr[0] <= pos.y && pos.y <= yr[1]
      ? 0 :
      Math.min(
        ...yr.map((yValue) => (yValue - pos.y) ** 2),
      );

    if (xSide + ySide > this.maxGridDistance ** 2) {
      return true;
    }

    return false;
  }

  bestGridPos(pos: Vec2) {
    const rounded = this.gridManager.snapPosition(pos);
    return {
      point: rounded,
      distance: pos.minus(rounded).magnitude,
    };
  }

  onMouseMove(e: CustomMouseMoveEvent) {
    let best = {
      point: new Vec2(),
      distance: Infinity,
    };

    Object.values(this.shapeRegistry.manifest)
      .forEach((v) => {
        v.curves.forEach((c) => {
          if (this.shouldSkip(e.pos, c)) {
            return;
          }

          const d = closestPoint({
            x: c.x,
            y: c.y,
            range: [0, 1],
            point: e.pos,
            iterations: 10,
            numSegments: 20,
          });

          if (best.distance < d.distance) return;
          best = d;
        });
      });

    const bestGrid = this.bestGridPos(e.pos);

    if (this.snapGrid && best.distance > bestGrid.distance) {
      // if best distance is bad and we're allowing snap grid, replace it
      best = bestGrid;
    } else if (!this.snapGrid && best.distance > this.maxCurveDistance) {
      // else if we're not allowing snap grid and distance is bad
      // given zoomed size of screen, surpress point finder
      unmount(this.element);
      return;
    }

    this.root.appendChild(this.element);

    setProps(this.element, {
      cx: best.point.x,
      cy: best.point.y,
    });
  }

  destroy() {
    super.destroy();
    unmount(this.element);
  }
}

export default PointFinder;
