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

class PointFinder extends Tool {
  shapeRegistry: Registry<Shape>;
  element: SVGCircleElement;
  root: SVGSVGElement;
  screenManager: ScreenManager;

  constructor(args: IToolArgs & {shapeRegistry: Registry<Shape>}) {
    super(args);
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

  get maxDistance() {
    return this.screenManager.height ** 2
    + this.screenManager.width ** 2 * 0.05;
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

    if (xSide + ySide > this.maxDistance ** 2) {
      return true;
    }

    return false;
  }

  onMouseMove(e: CustomMouseMoveEvent) {
    let best = {
      point: new Vec2(),
      distance: Infinity,
    };
    const { maxDistance } = this;

    Object.values(this.shapeRegistry.manifest)
      .forEach((v) => {
        v.curves.forEach((c) => {
          if (this.shouldSkip(e.pos, c)) return;

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

    if (best.distance > maxDistance) {
      unmount(this.element);
    } else {
      this.root.appendChild(this.element);

      setProps(this.element, {
        cx: best.point.x,
        cy: best.point.y,
      });
    }
  }

  destroy() {
    super.destroy();
    unmount(this.element);
  }
}

export default PointFinder;
