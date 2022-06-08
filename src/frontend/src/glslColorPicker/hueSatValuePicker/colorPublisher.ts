interface HSVColor {
    hue: number,
    saturation: number,
    value: number
}

type Subscription<T> = (arg: T) => void;

interface Color {hsv: HSVColor}

class ColorPublisher {
  color: Color;
  subscriptions: Set<Subscription<Color>>;

  constructor() {
    this.subscriptions = new Set();
    this.color = {
      hsv: {
        hue: 190,
        saturation: 100,
        value: 80,
      },
    };
  }

  set<T extends keyof Color>(colorSpace: T, incoming: Partial<Color[T]>) {
    Object.assign(this.color[colorSpace], incoming);
    this.publish();
  }

  subscribe(fn: Subscription<Color>) {
    fn(this.color);
    this.subscriptions.add(fn);
  }

  unsubscribe(fn: Subscription<Color>) {
    this.subscriptions.delete(fn);
  }

  publish() {
    this.subscriptions.forEach((s) => s(this.color));
  }
}

export { ColorPublisher };
export type { HSVColor, Color };
