import Tool, { IToolArgs } from '../tool';
import {
  CustomMouseDownEvent,
  CustomMouseMoveEvent,
  CustomMouseUpEvent,
  CustomDragEvent,
} from '../../events/EventsInterface';
import { ShapeWithUI } from '../../entities/pointListItem';
import LayerManager from '../../entities/layers/layerManager';
import Anchor from '../../entities/points/anchor';

class PenTool extends Tool {
  activeNode: Anchor | null;

  private root: SVGSVGElement;
  private layerManager: LayerManager;

  constructor(args: IToolArgs & {layerManager: LayerManager}) {
    super(args);

    this.layerManager = args.layerManager;
    this.root = args.root;
    this.activeNode = null;
  }

  onEscape() {
    this.activeNode?.destroy();
    this.activeNode = null;
  }

  onMouseMove(e: CustomMouseMoveEvent) {
    if (this.activeNode) this.activeNode.setPosition(e.pos);
  }

  onMouseDown(e: CustomMouseDownEvent) {
    const clickedPoint = e.element instanceof Anchor ? e.element : null;

    if (!this.activeNode) {
      if (!clickedPoint) {
        const newShape = new ShapeWithUI({
          root: this.root,
          layer: this.layerManager.activeLayer,
        });

        newShape.push(e.pos);
        this.activeNode = newShape.lastPoint();
        return;
      }

      this.activeNode = clickedPoint;
      return;
    }

    if (!clickedPoint) {
      // if (this.activeNode.isFirstPoint()) {
      //   this.activeNode.getShape().unshift(e.pos);
      // } else {
      //   this.activeNode.getShape().push(e.pos);
      // }
      return;
    }

    if (!clickedPoint.isEdge()) {
      // this point has a full valence and is nonreactive.
      return;
    }

    // else we figure out how to join the paths.

    // first, destroy the active node.
    this.activeNode.destroy();

    if (this.activeNode.getShape() === clickedPoint.getShape()) {
      this.activeNode.getShape().close();
      this.activeNode = this.activeNode.getShape().firstPoint();
      return;
    }

    this.activeNode.getShape().merge(
      clickedPoint.getShape(),
      this.activeNode.isLastPoint() ? 'front' : 'back',
    );

    this.activeNode = clickedPoint;
  }

  onDrag(e: CustomDragEvent) {
    if (!this.activeNode) throw new Error('No active node!');
    this.activeNode.setHandle('next', e.pos);
  }

  onMouseUp(e: CustomMouseUpEvent) {
    const prev = this.activeNode;

    if (this.activeNode?.getShape().isClosed) {
      // shape is closed. clear the pen tool.
      this.activeNode = null;
      return;
    }

    if (prev) prev.commit();

    if (this.activeNode) {
      const shape = this.activeNode.getShape();

      if (!this.activeNode.isLastPoint()) {
        shape.unshift(e.pos);
        this.activeNode = shape.firstPoint();
      } else {
        shape.push(e.pos);
        this.activeNode = shape.lastPoint();
      }
    }
  }

  destroy() {}
}

export default PenTool;
