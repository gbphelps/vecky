import { create, setProps } from '../../utils';
import { PointListItem, Point } from './point';

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
      const controlPoints: Point[] = [];

      const handle1 = node.handles.next;
      const handle2 = node.next?.handles.prev;
      const nxt: PointListItem | null = node.next;

      [handle1, handle2, nxt].forEach((p) => {
        if (p) controlPoints.push(p);
      });

      const command = COMMAND_LOOKUP[controlPoints.length];

      d.push(`${command} ${controlPoints.map((p) => `${p.x} ${p.y}`).join(' ')}`);
      node = nxt;
    }

    setProps(this.element, { d: d.join(' ') });
  }

  destroy() {
    this.root.removeChild(this.element);
  }
}

export default Shape;
