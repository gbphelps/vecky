class PubSub<T> {
  value: T | null;

  subscriptions: Set<(arg: T) => void>;

  constructor() {
    this.subscriptions = new Set();
    this.value = null;
  }

  set(value: T) {
    this.value = value;
    this.subscriptions.forEach((fn) => fn(value));
  }

  subscribe(fn: (arg: T) => void) {
    this.subscriptions.add(fn);
  }

  unsubscribe(fn: (arg: T) => void) {
    this.subscriptions.delete(fn);
  }
}

export default PubSub;
