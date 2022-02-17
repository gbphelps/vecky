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
  dir: 'next' | 'prev';

  private root: SVGSVGElement;
  private layerManager: LayerManager;

  constructor(args: IToolArgs & {layerManager: LayerManager}) {
    super(args);

    this.layerManager = args.layerManager;
    this.root = args.root;
    this.activeNode = null;
    this.dir = 'next';
  }

  onEscape() {
    this.dir = 'next';
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

      if (clickedPoint.isFirstPoint()) this.dir = 'prev';
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

    // else join paths.
    // first, destroy the active node.
    const activeIsLast = this.activeNode.isLastPoint();
    this.activeNode.destroy();

    if (this.activeNode.getShape() === clickedPoint.getShape()) {
      // close shape
      this.activeNode.getShape().close();
      this.activeNode = activeIsLast
        ? this.activeNode.getShape().firstPoint()
        : this.activeNode.getShape().lastPoint();
      return;
    }

    this.activeNode = this.activeNode.getShape().lastPoint();

    const shouldReverse = (this.dir === 'next' && clickedPoint.isLastPoint())
      || (this.dir === 'prev' && clickedPoint.isFirstPoint());

    const isFrontMerge = clickedPoint.isLastPoint();

    this.activeNode.getShape().merge(
      clickedPoint.getShape(),
      isFrontMerge ? 'front' : 'back',
      shouldReverse,
    );

    if (isFrontMerge) this.dir = 'prev';

    this.activeNode = clickedPoint;
  }

  onDrag(e: CustomDragEvent) {
    if (!this.activeNode) throw new Error('No active node!');
    this.activeNode.setHandle(this.dir, e.pos);
  }

  onMouseUp(e: CustomMouseUpEvent) {
    if (!this.activeNode) return;

    if (this.activeNode.getShape().isClosed || !this.activeNode.isEdge()) {
      // shape is closed. clear the pen tool.
      this.activeNode = null;
      this.dir = 'next';
      return;
    }

    this.dir = this.activeNode?.isLastPoint() ? 'next' : 'prev';

    this.activeNode.commit();

    const shape = this.activeNode.getShape();

    if (!this.activeNode.isLastPoint()) {
      shape.unshift(e.pos);
      this.activeNode = shape.firstPoint();
    } else {
      shape.push(e.pos);
      this.activeNode = shape.lastPoint();
    }
  }

  destroy() {}
}

export default PenTool;
