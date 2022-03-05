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

function unmount(element: SVGElement) {
  if (!element.parentElement) {
    // console.log('element is not mounted!');
    return;
  }
  element.parentElement.removeChild(element);
}

function oppSigns(a: number, b: number) {
  if (Number.isNaN(a) || Number.isNaN(b)) return false;

  return (a < 0 && b > 0) || (a > 0 && b < 0);
}
function lerp(a: number, b: number, w: number) {
  return a + (b - a) * w;
}

export {
  setProps,
  create,
  lerp,
  oppSigns,
  unmount,
};
