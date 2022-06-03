interface HSVColor {
    hue: number,
    saturation: number,
    value: number
}

type Subscription<T> = (arg: T) => void;

class ColorPublisher {
  color: HSVColor;
  subscriptions: Set<Subscription<HSVColor>>;

  constructor() {
    this.subscriptions = new Set();
    this.color = {
      hue: 100,
      saturation: 100,
      value: 0,
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
export type { HSVColor };
