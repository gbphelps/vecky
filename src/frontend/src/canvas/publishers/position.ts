import Vec2 from '../vec2';
import Publisher from './publisher';

class Position extends Publisher<Vec2> {
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

export default Position;
