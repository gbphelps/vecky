import { CustomDragEvent, CustomMouseDownEvent } from '../../events/EventsInterface';
import Tool from '../tool';
import Anchor from '../../entities/points/anchor';
import { TContext } from '../../types';

class AnchorTool extends Tool {
  activeAnchor: Anchor | null;

  constructor(args: TContext) {
    super(args);
    this.activeAnchor = null;
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
