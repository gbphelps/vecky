import Tool from '../tool';
import Shape from '../../entities/shape';
import { CustomDragEvent, CustomDragStartEvent } from '../../events/EventsInterface';
import Vec2 from '../../utils/vec2';
import { makeCircleShape } from '../../utils/arcBezier';
import Registry from '../../entities/registry';
import LayerManager from '../../entities/layers/layerManager';
import Point from '../../entities/points/point';
import IntersectionsRegistry from '../../intersectionsRegistry';
import { TContext } from '../../types';

class ArcTool extends Tool {
  shape: Shape | null;
  center: Vec2 | null;
  layerManager: LayerManager;
  shapeRegistry: Registry<Shape>;
  pointRegistry: Registry<Point>;
  intersectionsRegistry: IntersectionsRegistry;

  constructor(args: TContext) {
    super(args);
    this.shape = null;
    this.center = null;
    this.layerManager = args.layerManager;
    this.shapeRegistry = args.shapeRegistry;
    this.pointRegistry = args.pointRegistry;
    this.intersectionsRegistry = args.intersectionsRegistry;
  }

  onDragEnd(): void {
    this.shape = null;
  }

  onDragStart(e: CustomDragStartEvent): void {
    this.center = e.dragStart;
  }

  onDrag(e: CustomDragEvent): void {
    if (!this.center) throw new Error();
    if (this.shape) {
      this.shape.destroy();
    }
    const radius = e.pos.minus(this.center).magnitude;
    this.shape = makeCircleShape({
      radius,
      center: this.center,
      nSeg: 4,
      layer: this.layerManager.activeLayer,
      shapeRegistry: this.shapeRegistry,
      pointRegistry: this.pointRegistry,
      intersectionsRegistry: this.intersectionsRegistry,
    });
  }
}

export default ArcTool;
