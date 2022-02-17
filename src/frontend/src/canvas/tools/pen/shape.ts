import { create, setProps } from '../../utils';
import { PointListItem } from '../../entities/pointListItem';
import Vec2 from '../../vec2';
import Layer from '../../entities/layers/layer';
import DomEntry from '../../entities/domEntry';

const COMMAND_LOOKUP: Record<number, string> = {
  1: 'L',
  2: 'Q',
  3: 'C',
};

class Shape extends DomEntry {
  readonly element: SVGPathElement;
  head: PointListItem;
  private layer: Layer;

  constructor(args: { head: PointListItem, root: SVGSVGElement, layer: Layer }) {
    super({ root: args.root });

    const { head, layer } = args;
    this.element = create('path');

    layer.drawLayer.appendChild(this.element);

    this.head = head;
    this.layer = layer;
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
    this.layer.drawLayer.removeChild(this.element);
  }
}

export default Shape;
