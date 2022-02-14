import Position from '../../publishers/position';
import { setProps, create, DoubleLinkedList } from '../../utils';
import Vec2 from '../../vec2';

interface PointArgs {
    root: SVGElement;
}

class Point {
  pos: Position;
  element: SVGElement;
  isActive: boolean;

  constructor(args: PointArgs) {
    const { root } = args;

    this.pos = new Position();

    this.element = this.createElement();
    this.pos.subscribe(this.update);
    root.appendChild(this.element);

    this.isActive = true;
    this.setIsActive(true);
  }

  setPosition(pos: Vec2) {
    this.pos.set(pos);
  }

  update = (pos: Vec2) => {
    setProps(this.element, { transform: `translate(${pos.x} ${pos.y})` });
  };

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
    return g;
  }

  destroy() {
    this.pos.unsubscribe(this.update);
  }
}

class PointListItem extends Point implements DoubleLinkedList<Point> {
  next: DoubleLinkedList<Point> | null;
  prev: DoubleLinkedList<Point> | null;

  constructor(args: PointArgs) {
    super(args);
    this.next = null;
    this.prev = null;
  }
}

export { Point, PointListItem };
