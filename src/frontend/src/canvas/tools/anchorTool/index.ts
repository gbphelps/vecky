import { CustomDragEvent, CustomMouseDownEvent, DehydratedEventState } from '../../events/EventsInterface';
import Tool from '../tool';
import Anchor from '../../entities/points/anchor';
import { TContext } from '../../types';

class AnchorTool extends Tool {
  activeAnchor: Anchor | null;

  constructor(
    ctx: TContext,
    initialEventState: DehydratedEventState | null,
    initAnchor?: Anchor,
  ) {
    super(ctx, initialEventState);
    this.activeAnchor = initAnchor ?? null;
  }

  setActiveAnchor(anchor: Anchor) {
    this.activeAnchor = anchor;
  }

  onMouseDown(e: CustomMouseDownEvent): void {
    this.activeAnchor = e.element instanceof Anchor ? e.element : null;
  }

  onDrag(e: CustomDragEvent): void {
    if (!this.activeAnchor) return;
    this.activeAnchor.setPosition(e.pos);
  }
}

export default AnchorTool;
