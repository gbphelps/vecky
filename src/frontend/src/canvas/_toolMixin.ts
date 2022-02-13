interface AddListenerProps<
Element extends SVGElement,
Event extends keyof SVGElementEventMap
>{
    element: Element,
    type: Event,
//     callback: (event: SVGElementEventMap[Event]) => void
// }

// function ToolMixin<T extends Constructor>(BaseClass: T) {
//   return class extends BaseClass {
//     teardownFns: (() => void)[];

//     constructor(...args: any[]) {
//       super(...args);
//       this.teardownFns = [];
//     }

//     addListener<
//     Element extends SVGElement,
//     Event extends keyof SVGElementEventMap
//     >(args: AddListenerProps<Element, Event>) {
//       const { element, type, callback } = args;

//       this.teardownFns.push(() => {
//         element.removeEventListener(type, callback);
//       });
//       element.addEventListener(type, callback);
//     }

//     destroy() {
//       this.teardownFns.forEach((fn) => fn());
//     }
//   };
// }

// export default ToolMixin;
