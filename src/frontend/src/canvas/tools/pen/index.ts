import Tool, { IToolArgs } from '../tool';
import {
  CustomMouseDownEvent, CustomMouseMoveEvent, CustomMouseUpEvent,
} from '../../events/EventsInterface';
import { PointListItem } from './point';

class PenTool extends Tool {
  activeNode: PointListItem | null;
  root: SVGElement;

  constructor(args: IToolArgs) {
    super(args);

    this.root = args.root;
    this.activeNode = null;
  }

  onMouseMove(e: CustomMouseMoveEvent) {
    if (this.activeNode) this.activeNode.pos.set(e.pos);
  }

  onMouseDown(e: CustomMouseDownEvent) {
    if (!this.activeNode && !e.element) {
      this.activeNode = new PointListItem({ root: this.root });
      this.activeNode.pos.set(e.pos);
    }
  }

  onMouseUp(e: CustomMouseUpEvent) {
    this.activeNode = new PointListItem({ root: this.root });
    this.activeNode.pos.set(e.pos);
  }

  destroy() {}
}

export default PenTool;
