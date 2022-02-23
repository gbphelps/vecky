import Tool, { IToolArgs } from '../tool';
import Shape from '../../entities/shape';
import Registry from '../../entities/registry';
import { CustomMouseMoveEvent } from '../../events/EventsInterface';
import { create, setProps } from '../../utils/misc';
import closestPoint from '../../utils/closestPoint';
import Vec2 from '../../utils/vec2';

class PointFinder extends Tool {
  shapeRegistry: Registry<Shape>;
  element: SVGCircleElement;
  root: SVGSVGElement;

  constructor(args: IToolArgs & {shapeRegistry: Registry<Shape>}) {
    super(args);
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
    Object.values(this.shapeRegistry.manifest)
      .forEach((v) => {
        v.curves.forEach((c) => {
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
