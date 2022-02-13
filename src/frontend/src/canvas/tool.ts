interface AddListenerProps<
Element extends SVGElement,
Event extends keyof SVGElementEventMap
>{
    element: Element,
    type: Event,
    callback: (event: SVGElementEventMap[Event]) => void
}

class Tool {
  teardownFns: (() => void)[];

  constructor() {
    this.teardownFns = [];
  }

  addListener<
    Element extends SVGElement,
    Event extends keyof SVGElementEventMap
    >(args: AddListenerProps<Element, Event>) {
    const { element, type, callback } = args;

    this.teardownFns.push(() => {
      element.removeEventListener(type, callback);
    });
    element.addEventListener(type, callback);
  }

  destroy() {
    this.teardownFns.forEach((fn) => fn());
  }
}

export default Tool;
