import Tool, { IToolArgs } from '../tool';
import Shape from '../../entities/shape';
import { CustomDragEvent, CustomDragStartEvent } from '../../events/EventsInterface';
import Vec2 from '../../utils/vec2';
import { makeCircleShape } from '../../utils/arcBezier';
import Registry from '../../entities/registry';
import LayerManager from '../../entities/layers/layerManager';
import Point from '../../entities/points/point';

interface Args extends IToolArgs {
    shapeRegistry: Registry<Shape>,
    layerManager: LayerManager
}

class ArcTool extends Tool {
  shape: Shape | null;
  center: Vec2 | null;
  layerManager: LayerManager;
  shapeRegistry: Registry<Shape>;
  pointRegistry: Registry<Point>;

  constructor(args: Args) {
    super(args);
    this.shape = null;
    this.center = null;
    this.layerManager = args.layerManager;
    this.shapeRegistry = args.shapeRegistry;
    this.pointRegistry = args.pointRegistry;
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
    });
  }
}

export default ArcTool;
