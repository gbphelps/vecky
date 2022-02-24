import Tool, { IToolArgs } from '../tool';
import Shape from '../../entities/shape';
import Registry from '../../entities/registry';
import { CustomMouseMoveEvent } from '../../events/EventsInterface';
import { create, setProps } from '../../utils/misc';
import closestPoint from '../../utils/closestPoint';
import Vec2 from '../../utils/vec2';
import ScreenManager from '../../screenManager';
import { range as getRange, getOverlap } from '../../utils/bezier';

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

    this.root.appendChild(this.element);
  }

  onMouseMove(e: CustomMouseMoveEvent) {
    let best = {
      point: new Vec2(),
      distance: Infinity,
    };

    // todo we can reject a bunch of these before even
    // testing them by using bounding boxes or something
    // ALSO FOR SURE reject everything out of screen

    const maxDistance = Math.sqrt(
      this.screenManager.height ** 2 +
      this.screenManager.width ** 2,
    ) * 0.05;

    Object.values(this.shapeRegistry.manifest)
      .forEach((v) => {
        v.curves.forEach((c) => {
          const right = this.screenManager.left + this.screenManager.width;
          const bottom = this.screenManager.top + this.screenManager.height;
          const { left, top } = this.screenManager;

          const xr = getRange(c.x);
          const yr = getRange(c.y);

          if (!getOverlap({
            x: xr,
            y: yr,
          }, {
            x: [left, right],
            y: [top, bottom],
          })) return;

          const xSide = (xr[0] <= e.pos.x && e.pos.x <= xr[1])
            ? 0
            : Math.min(
              ...xr.map((xValue) => (xValue - e.pos.x) ** 2),
            );

          const ySide = yr[0] <= e.pos.y && e.pos.y <= yr[1]
            ? 0 :
            Math.min(
              ...yr.map((yValue) => (yValue - e.pos.y) ** 2),
            );

          if (xSide + ySide > maxDistance ** 2) {
            return { point: new Vec2(), distance: Infinity };
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

    setProps(this.element, {
      cx: best.point.x,
      cy: best.point.y,
    });
  }

  destroy() {
    super.destroy();
    this.root.removeChild(this.element);
  }
}

export default PointFinder;
