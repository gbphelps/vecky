type Subscription<TMessage> = (arg: TMessage) => void;

class PubSub<TMessage> {
  subscriptions: Set<Subscription<TMessage>>;
  getMessage: () => TMessage;

  constructor(getMessage: () => TMessage) {
    this.subscriptions = new Set();
    this.getMessage = getMessage;
  }

  subscribe(fn: Subscription<TMessage>) {
    const message = this.getMessage();
    fn(message);

    this.subscriptions.add(fn);
  }

  unsubscribe(fn: Subscription<TMessage>) {
    this.subscriptions.delete(fn);
  }

  publish() {
    const message = this.getMessage();
    this.subscriptions.forEach((s) => s(message));
  }
}

export default PubSub;
export type { Subscription };
