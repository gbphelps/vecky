class Vec2 {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  minus(other: Vec2) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  plus(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }
}

export default Vec2;
