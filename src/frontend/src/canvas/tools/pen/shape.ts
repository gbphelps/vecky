import { create, setProps } from '../../utils';
import { PointListItem } from '../../entities/pointListItem';
import Vec2 from '../../vec2';

const COMMAND_LOOKUP: Record<number, string> = {
  1: 'L',
  2: 'Q',
  3: 'C',
};

class Shape {
  root: SVGSVGElement;
  readonly element: SVGPathElement;
  head: PointListItem;

  constructor(args: { head: PointListItem, root: SVGSVGElement }) {
    const { head, root } = args;
    this.element = create('path');
    root.appendChild(this.element);

    this.head = head;
    this.root = root;
  }

  get nodeList() {
    const nodes = [];
    const seen = new Set();

    let node: PointListItem | null = this.head;

    while (node) {
      if (seen.has(node)) break;
      nodes.push(node);
      seen.add(node);

      node = node.next;
    }

    return nodes;
  }

  update() {
    const d = [`M ${this.head.x} ${this.head.y}`];

    this.nodeList.forEach((node) => {
      const controlPoints: Vec2[] = [];

      const handle1 = node.handlePositions.next;
      const handle2 = node.next?.handlePositions.prev;
      const endpoint: Vec2 | undefined = node.next?.pos;

      [handle1, handle2, endpoint].forEach((p) => {
        if (p) controlPoints.push(p);
      });

      if (controlPoints.length) {
        const command = COMMAND_LOOKUP[controlPoints.length];
        d.push(`${command} ${controlPoints.map((p) => `${p.x} ${p.y}`).join(' ')}`);
      }
    });

    setProps(this.element, { d: d.join(' ') });
  }

  destroy() {
    this.root.removeChild(this.element);
  }
}

export default Shape;
