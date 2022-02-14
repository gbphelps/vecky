import Position from '../../publishers/position';
import { setProps, create } from '../../utils';

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

export default Point;
