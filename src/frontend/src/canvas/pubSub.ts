abstract class PubSub<T> {
  abstract publish(): T

  value: T | null;

  subscriptions: Set<(arg: T) => void>;

  constructor() {
    this.subscriptions = new Set();
    this.value = null;

    const publish = this.publish.bind(this);

    this.publish = () => {
      const value = publish();
      this.value = value;
      this.subscriptions.forEach((fn) => fn(value));
      return value;
    };
  }

  subscribe(fn: (arg: T) => void) {
    this.subscriptions.add(fn);
  }

  unsubscribe(fn: (arg: T) => void) {
    this.subscriptions.delete(fn);
  }
}

export default PubSub;
