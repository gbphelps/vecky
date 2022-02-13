class EventManager {
  element: Document | SVGElement;
  teardownFns: (() => void)[];
  _id: number;

  static counter = 0;

  constructor(element: Document | SVGElement) {
    this._id = EventManager.counter++;
    this.element = element;
    this.teardownFns = [];
  }

  add<Type extends keyof GlobalEventHandlersEventMap>(
    type: Type,
    fn: (a: GlobalEventHandlersEventMap[Type]) => void,
    options?: AddEventListenerOptions,
  ) {
    this.element.addEventListener(
      type,
      // @ts-ignore
      fn,
      options,
    );
    this.teardownFns.push(
      () => this.element.removeEventListener(
        type,
        // @ts-ignore
        fn,
        options,
      ),
    );
  }

  destroy() {
    this.teardownFns.forEach((fn) => fn());
    this.teardownFns = [];
  }
}

export default EventManager;
