import Tool, { IToolArgs } from '../tool';
import Shape from '../../entities/shape';
import Registry from '../../entities/registry';
import { CustomMouseMoveEvent } from '../../events/EventsInterface';

class PointFinder extends Tool {
  shapeRegistry: Registry<Shape>;

  constructor(args: IToolArgs & {shapeRegistry: Registry<Shape>}) {
    super(args);
    this.shapeRegistry = args.shapeRegistry;
  }

  onMouseMove(e: CustomMouseMoveEvent) {}

  destroy() {
    super.destroy();
  }
}

export default PointFinder;
