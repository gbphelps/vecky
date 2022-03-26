import Tool from '../tool';
import {
  CustomMouseDownEvent,
  CustomMouseMoveEvent,
  CustomMouseUpEvent,
  CustomDragEvent,
} from '../../events/EventsInterface';
import Shape from '../../entities/shape';
import LayerManager from '../../entities/layers/layerManager';
import Anchor from '../../entities/points/anchor';
import Registry from '../../entities/registry';
import Point from '../../entities/points/point';
import IntersectionsRegistry from '../../intersectionsRegistry';
import { TContext } from '../../types';

class PenTool extends Tool {
  activeNode: Anchor | null;
  dir: 'next' | 'prev';

  private layerManager: LayerManager;
  private pointRegistry: Registry<Point>;
  private shapeRegistry: Registry<Shape>;
  private intersectionsRegistry: IntersectionsRegistry;

  constructor(
    ctx: TContext,
  ) {
    super(ctx);

    this.intersectionsRegistry = ctx.intersectionsRegistry;
    this.pointRegistry = ctx.pointRegistry;
    this.shapeRegistry = ctx.shapeRegistry;
    this.layerManager = ctx.layerManager;
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
        const newShape = new Shape({
          pointRegistry: this.pointRegistry,
          shapeRegistry: this.shapeRegistry,
          layer: this.layerManager.activeLayer,
          intersectionsRegistry: this.intersectionsRegistry,
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

    this.activeNode.getShape().merge(
      clickedPoint.getShape(),
      this.dir,
      clickedPoint.isLastPoint() ? 'next' : 'prev',
    );

    this.activeNode = clickedPoint;
  }

  onDrag(e: CustomDragEvent) {
    if (!this.activeNode) throw new Error('No active node!');

    this.activeNode.setHandle(this.dir, e.pos);
  }

  onMouseUp(e: CustomMouseUpEvent) {
    // TODO TODO finish debugging intersections
    // if (this.activeNode?.getShape()) {
    //   this.intersectionsRegistry.addShape(this.activeNode.getShape());
    // }

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
}

export default PenTool;
