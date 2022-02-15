import { SVGAttributes } from 'react';

function setProps<T extends SVGElement>(el: SVGElement, props: SVGAttributes<T>) {
  (Object.keys(props) as (keyof typeof props)[]).forEach((k) => {
    if (k === 'style') {
      Object.assign(el.style, props.style);
    } else {
      el.setAttribute(k, String(props[k]));
    }
  });
}

interface TypeMap {
  path: SVGPathElement,
  svg: SVGSVGElement,
  circle: SVGCircleElement,
  line: SVGLineElement,
  g: SVGGElement
}

function create<T extends keyof TypeMap>(type: T, props?: SVGAttributes<TypeMap[T]>) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', type);
  setProps(el, props ?? {});
  return el;
}

interface DoubleLinkedList<T> {
  next: DoubleLinkedList<T> | null,
  prev: DoubleLinkedList<T> | null,
}

function reverseDoubleLinkedList<T>(
  ll: DoubleLinkedList<T>,
  transform?: (a: DoubleLinkedList<T>) => void,
) {
  let node: DoubleLinkedList<T> | null = ll;
  while (node.next) node = node.next;

  while (node) {
    const nxt: DoubleLinkedList<T> | null = node.next;
    const prv: DoubleLinkedList<T> | null = node.prev;

    if (transform) transform(node);

    if (nxt) nxt.next = node;
    node.prev = nxt;

    node = prv;
  }

  // eslint-disable-next-line no-param-reassign
  ll.next = null;
  return ll;
}

export { setProps, create, reverseDoubleLinkedList };
export type { DoubleLinkedList };
