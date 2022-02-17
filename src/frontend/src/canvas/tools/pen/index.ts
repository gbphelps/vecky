import Tool, { IToolArgs } from '../tool';
import {
  CustomMouseDownEvent,
  CustomMouseMoveEvent,
  CustomMouseUpEvent,
  CustomDragEvent,
} from '../../events/EventsInterface';
import { PointListItem } from '../../entities/pointListItem';
import { reverseDoubleLinkedList } from '../../utils';
import LayerManager from '../../entities/layers/layerManager';

class PenTool extends Tool {
  activeNode: PointListItem | null;
  private root: SVGSVGElement;
  private layerManager: LayerManager;

  constructor(args: IToolArgs & {layerManager: LayerManager}) {
    super(args);

    this.layerManager = args.layerManager;
    this.root = args.root;
    this.activeNode = null;
  }

  onMouseMove(e: CustomMouseMoveEvent) {
    if (this.activeNode) this.activeNode.setPosition(e.pos);
  }

  onMouseDown(e: CustomMouseDownEvent) {
    const clickedPoint = e.element instanceof PointListItem ? e.element : null;

    if (!this.activeNode) {
      if (!e.element) {
        this.activeNode = new PointListItem({
          root: this.root,
          layer: this.layerManager.activeLayer,
        });
        this.activeNode.setPosition(e.pos);
        return;
      }
      this.activeNode = clickedPoint;
      return;
    }

    if (!clickedPoint) {
      // may need to handle this later, but not now.
      return;
    }

    if (clickedPoint.next && clickedPoint.prev) {
      // this point has a full valence and is nonreactive.
      return;
    }

    // else we figure out how to join the paths.

    // first, destroy the active node.
    this.activeNode.destroy();
    this.activeNode = this.activeNode.prev;

    // reverse node if necessary
    if (clickedPoint.prev) reverseDoubleLinkedList(clickedPoint);

    this.activeNode?.setNext(clickedPoint);
    this.activeNode = clickedPoint;
  }

  onDrag(e: CustomDragEvent) {
    if (!this.activeNode) throw new Error('No active node!');
    this.activeNode.setHandle('next', e.pos);
  }

  onMouseUp(e: CustomMouseUpEvent) {
    const prev = this.activeNode;

    if (this.activeNode?.next && this.activeNode?.prev) {
      // shape is closed. clear the pen tool.
      this.activeNode = null;
      return;
    }

    if (prev) prev.commit();
    this.activeNode = new PointListItem({ root: this.root, layer: this.layerManager.activeLayer });
    this.activeNode.setPosition(e.pos);
    this.activeNode.setPrev(prev);
  }

  destroy() {}
}

export default PenTool;
