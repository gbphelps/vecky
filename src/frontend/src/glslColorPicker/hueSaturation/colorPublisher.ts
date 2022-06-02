interface HSVColor {
    hue: number,
    saturation: number,
    value: number
}

type Subscription<T> = (arg: T) => void;

function easeInOut(x: number) {
  return (1 - Math.cos(x * Math.PI)) / 2;
}

function valToColor(val: number) {
  const p = val % 1;

  if (val <= 1) {
    return [1, easeInOut(p), 0];
  }

  if (val <= 2) {
    return [easeInOut(1 - p), 1, 0];
  }

  if (val <= 3) {
    return [0, 1, easeInOut(p)];
  }

  if (val <= 4) {
    return [0, easeInOut(1 - p), 1];
  }

  if (val <= 5.0) {
    return [easeInOut(p), 0, 1];
  }

  return [1, 0, easeInOut(1 - p)];
}

class ColorPublisher {
  color: HSVColor;
  subscriptions: Set<Subscription<HSVColor>>;

  constructor() {
    this.subscriptions = new Set();
    this.color = {
      hue: 100,
      saturation: 100,
      value: 100,
    };
  }

  set(incoming: Partial<HSVColor>) {
    Object.assign(this.color, incoming);
    this.publish();
  }

  subscribe(fn: Subscription<HSVColor>) {
    fn(this.color);
    this.subscriptions.add(fn);
  }

  unsubscribe(fn: Subscription<HSVColor>) {
    this.subscriptions.delete(fn);
  }

  publish() {
    this.subscriptions.forEach((s) => s(this.color));
  }
}

export { ColorPublisher };
