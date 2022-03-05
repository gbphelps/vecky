import Tool, { IToolArgs } from '../tool';
import Shape from '../../entities/shape';
import { CustomDragStartEvent } from '../../events/EventsInterface';
import Vec2 from '../../utils/vec2';

class ArcTool extends Tool {
  shape: Shape | null;
  center: Vec2 | null;

  constructor(args: IToolArgs) {
    super(args);
    this.shape = null;
    this.center = null;
  }

  onMouseUp(): void {
    this.shape = null;
  }

  onDragStart(e: CustomDragStartEvent): void {
    this.center = e.dragStart;
  }

  onDrag()
}
