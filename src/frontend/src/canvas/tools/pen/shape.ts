import { create, setProps } from '../../utils';
import { PointListItem } from './point';
import Vec2 from '../../vec2';

const COMMAND_LOOKUP: Record<number, string> = {
  1: 'L',
  2: 'Q',
  3: 'C',
};

class Shape {
  root: SVGElement;
  readonly element: SVGPathElement;
  head: PointListItem;

  constructor(args: { head: PointListItem, root: SVGElement }) {
    const { head, root } = args;
    this.element = create('path');
    root.appendChild(this.element);

    this.head = head;
    this.root = root;
  }

  update() {
    const d = [`M ${this.head.x} ${this.head.y}`];

    let node: PointListItem | null = this.head;
    while (node) {
      const controlPoints: Vec2[] = [];

      const handle1 = node.handlePositions.next;
      const handle2 = node.next?.handlePositions.prev;
      const endpoint: Vec2 | undefined = node.next?.pos;

      [handle1, handle2, endpoint].forEach((p) => {
        if (p) controlPoints.push(p);
      });

      const command = COMMAND_LOOKUP[controlPoints.length];

      d.push(`${command} ${controlPoints.map((p) => `${p.x} ${p.y}`).join(' ')}`);
      node = node.next;
    }

    setProps(this.element, { d: d.join(' ') });
  }

  destroy() {
    this.root.removeChild(this.element);
  }
}

export default Shape;
