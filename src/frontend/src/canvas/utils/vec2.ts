class Vec2 {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x ?? 0;
    this.y = y ?? 0;
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  minus(other: Vec2) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  plus(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  times(n: number) {
    return new Vec2(this.x * n, this.y * n);
  }

  distance(other: Vec2) {
    return this.minus(other).magnitude;
  }
}

export default Vec2;
