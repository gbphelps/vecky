import Tool, { IToolArgs } from '../tool';
import {
  CustomMouseDownEvent,
  CustomMouseMoveEvent,
  CustomMouseUpEvent,
  CustomDragEvent,
} from '../../events/EventsInterface';
import { PointListItem } from '../../entities/pointListItem';

class PenTool extends Tool {
  activeNode: PointListItem | null;
  root: SVGElement;

  constructor(args: IToolArgs) {
    super(args);

    this.root = args.root;
    this.activeNode = null;
  }

  onMouseMove(e: CustomMouseMoveEvent) {
    if (this.activeNode) this.activeNode.setPosition(e.pos);
  }

  onMouseDown(e: CustomMouseDownEvent) {
    if (!this.activeNode && !e.element) {
      this.activeNode = new PointListItem({ root: this.root });
      this.activeNode.setPosition(e.pos);
    }
  }

  onDrag(e: CustomDragEvent) {
    if (!this.activeNode) throw new Error('No active node!');
    this.activeNode.setHandle('next', e.pos);
  }

  onMouseUp(e: CustomMouseUpEvent) {
    const prev = this.activeNode;

    this.activeNode = new PointListItem({ root: this.root });
    this.activeNode.setPosition(e.pos);
    this.activeNode.setPrev(prev);
  }

  destroy() {}
}

export default PenTool;
