import Tool, { IToolArgs } from '../tool';
import Vec2 from '../../vec2';
import PubSub from '../../pubSub';
import { create, setProps } from '../../utils';
import {
  CustomMouseDownEvent, CustomMouseMoveEvent, CustomDragEvent, CustomMouseUpEvent,
} from '../../events/EventsInterface';

class Position extends PubSub<Vec2> {
  private _pos: Vec2;

  constructor() {
    super();

    this._pos = new Vec2();
  }

  set(pos: Vec2) {
    this._pos = pos;
    this.publish();
  }

  publish() {
    return this._pos;
  }
}

class Point {
  pos: Position;
  element: SVGElement;
  isActive: boolean;

  constructor(args: {root: SVGElement}) {
    const { root } = args;

    this.pos = new Position();
    this.element = this.createElement();
    root.appendChild(this.element);

    this.isActive = true;
    this.setIsActive(true);
  }

  setIsActive(value: boolean) {
    this.isActive = value;
    setProps(this.element, {
      style: {
        pointerEvents: value ? 'none' : 'auto',
      },
    });
  }

  createElement() {
    const g = create('g');
    const circle = create('circle', {
      cx: 0,
      cy: 0,
      r: '.5%',
    });

    g.appendChild(circle);

    this.pos.subscribe((pos) => {
      setProps(g, { transform: `translate(${pos.x} ${pos.y})` });
    });

    return g;
  }
}

class PenTool extends Tool {
  activeNode: Point | null;
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
      this.activeNode = new Point({ root: this.root });
      this.activeNode.pos.set(e.pos);
    }
  }

  onMouseUp(e: CustomMouseUpEvent) {
    this.activeNode = new Point({ root: this.root });
    this.activeNode.pos.set(e.pos);
  }

  destroy() {}
}

export default PenTool;
