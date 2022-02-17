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
  reverseNode: () => void,
  print: () => any[]
}

function reverseDoubleLinkedList<T>(ll: DoubleLinkedList<T>) {
  let head = ll;
  while (head.next) head = head.next;

  function _s(node: DoubleLinkedList<T> | null) {
    if (!node) return node;

    node.reverseNode();

    const next = _s(node.prev);

    // eslint-disable-next-line no-param-reassign
    node.next = next;
    if (next) next.prev = node;
    return node;
  }

  _s(head);
  head.prev = null;

  return head;
}

export { setProps, create, reverseDoubleLinkedList };
export type { DoubleLinkedList };
