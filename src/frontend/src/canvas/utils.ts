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

function create<T extends SVGElement>(type: string, props?: SVGAttributes<T>) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', type);
  setProps(el, props ?? {});
  return (el as T);
}

export { setProps, create };
