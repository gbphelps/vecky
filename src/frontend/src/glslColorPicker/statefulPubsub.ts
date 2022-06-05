type Subscription<TMessage> = (arg: TMessage) => void;

type MergeFn<T> = (arg: T) => T;

class PubSub<TMessage> {
  subscriptions: Set<Subscription<TMessage>>;
  value: TMessage;

  constructor(initialValue: TMessage) {
    this.subscriptions = new Set();
    this.value = initialValue;
  }

  subscribe(fn: Subscription<TMessage>) {
    fn(this.value);
    this.subscriptions.add(fn);
  }

  unsubscribe(fn: Subscription<TMessage>) {
    this.subscriptions.delete(fn);
  }

  set(v: TMessage | MergeFn<TMessage>) {
    if (typeof v === 'function') {
      const func = v as MergeFn<TMessage>;
      this.value = func(this.value);
    } else {
      this.value = v;
    }
    this.publish();
  }

  publish() {
    this.subscriptions.forEach((s) => s(this.value));
  }
}

export default PubSub;
export type { Subscription };
