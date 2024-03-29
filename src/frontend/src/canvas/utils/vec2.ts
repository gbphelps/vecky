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

  equals(other: Vec2) {
    return this.x === other.x && this.y === other.y;
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

  rotate(theta: number) {
    const sin = Math.sin(theta);
    const cos = Math.cos(theta);

    return new Vec2(
      cos * this.x - sin * this.y,
      sin * this.x + cos * this.y,
    );
  }

  dot(other: Vec2) {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vec2) {
    return this.x * other.y - this.y * other.x;
  }

  angle(other: Vec2) {
    let ratio = this.cross(other) /
    (this.magnitude * other.magnitude);
    ratio = Math.min(1, ratio);
    ratio = Math.max(-1, ratio);

    return Math.asin(ratio);
  }

  distance(other: Vec2) {
    return this.minus(other).magnitude;
  }
}

export default Vec2;
