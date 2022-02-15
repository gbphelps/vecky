import { PointArgs, IHandle, IAnchor } from './types';
import Point from './point';
import { create, setProps } from '../../utils';
import Vec2 from '../../vec2';

class Handle extends Point implements IHandle {
  private readonly connector: SVGLineElement;
  private readonly anchor: IAnchor;

  constructor(args: PointArgs & {anchor: IAnchor}) {
    const { root, anchor } = args;
    super({ root });

    this.connector = this.createConnector();
    args.root.appendChild(this.connector);

    this.anchor = anchor;
  }

  private createConnector() {
    return create('line');
  }

  protected update() {
    super.update();
    setProps(this.connector, {
      x1: this.anchor.x,
      y1: this.anchor.y,
      x2: this.x,
      y2: this.y,
      stroke: 'black',
      strokeWidth: 5,
    });
  }

  setPosition(pos: Vec2) {
    super.setPosition(pos);
    this.update();
  }
}

export default Handle;
