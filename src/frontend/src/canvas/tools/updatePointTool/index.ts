import { CustomDragEvent, CustomMouseDownEvent } from '../../events/EventsInterface';
import Tool from '../tool';
import Anchor from '../../entities/points/anchor';
import Handle from '../../entities/points/handle';
import { TContext } from '../../types';

class UpdatePointTool extends Tool {
  activePoint: Anchor | Handle | null;

  constructor(
    ctx: TContext,
    initPoint?: Anchor | Handle,
  ) {
    super(ctx);
    this.activePoint = initPoint ?? null;
  }

  setActiveAnchor(point: Anchor | Handle) {
    this.activePoint = point;
  }

  onMouseDown(e: CustomMouseDownEvent): void {
    this.activePoint = e.element instanceof Anchor ? e.element : null;
  }

  onDrag(e: CustomDragEvent): void {
    if (!this.activePoint) return;
    this.activePoint.setPosition(e.pos);
  }
}

export default UpdatePointTool;
