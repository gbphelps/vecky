import { Subscription } from '../../canvas/publishers/pubSub';
import { DropDown } from '../dropDown';
import PubSub from '../statefulPubsub';
import { ColorPublisher, HSVColor } from './colorPublisher';
import { HueSatCircleSlider } from './sliders/hueSatCircleSlider';
import { ValueSlider } from './sliders/valueSlider';

function hueParser(str: string) {
  const v = +str;
  if (Number.isNaN(v)) throw new Error('unparsable');
  return v < 0 ? 360 + v % 360 : v % 360;
}

function defaultParser(str: string) {
  const v = +str;
  if (Number.isNaN(v)) throw new Error('unparsable');
  return Math.max(0, Math.min(100, v));
}

class Input {
  colorPublisher: ColorPublisher;
  inputElement: HTMLInputElement;
  key: keyof HSVColor;
  format: (a:number) => string;
  parse: (a: string) => number;
  destroyCb: () => void;
  container: HTMLLabelElement;

  constructor({
    label, root, init, colorPublisher, key, format, parse,
  }:{
    label: string,
    root: HTMLElement,
    init: (this: Input) => () => void,
    colorPublisher: ColorPublisher,
    key: keyof HSVColor,
    format: (a:number) => string,
    parse: (a: string) => number,
  }) {
    this.key = key;
    this.colorPublisher = colorPublisher;
    this.format = format.bind(this);
    this.parse = parse.bind(this);

    this.container = document.createElement('label');
    Object.assign(this.container.style, {
      width: 0,
      flexGrow: 1,
      paddingRight: '8px',
    });

    const labelElement = document.createElement('div');
    labelElement.innerText = label;
    Object.assign(labelElement.style, {
      fontVariant: 'small-caps',
    });

    const inputElement = document.createElement('input');
    Object.assign(inputElement.style, {
      width: '100%',
      margin: 0,
    });
    inputElement.type = 'text';

    root.appendChild(this.container);
    this.container.appendChild(labelElement);
    this.container.appendChild(inputElement);
    this.inputElement = inputElement;
    this.destroyCb = init.call(this);

    this.inputElement.addEventListener('blur', () => {
      this.inputElement.value = this.format(
        this.colorPublisher.color[this.key],
      );
    });

    this.inputElement.addEventListener('input', () => {
      try {
        const val = this.parse(this.inputElement.value);
        this.colorPublisher.set({ [this.key]: val });
      } catch {
        //
      }
    });
  }

  destroy() {
    this.destroyCb();
    this.container.parentElement?.removeChild(this.container);
  }
}

class ColorPicker {
  picker: HueSatValuePicker | null;

  constructor({ root }: {root: HTMLElement}) {
    const colorPublisher = new ColorPublisher();
    const div = document.createElement('div');
    Object.assign(div.style, {
      position: 'absolute',
      top: '12px',
      left: '12px',
      padding: '20px',
      background: 'white',
      boxShadow: '0 4px 16px rgba(0,0,0,.2)',
      borderRadius: '3px',
    });
    root.appendChild(div);

    this.picker = null;

    const colorSpace = new PubSub('HSV');

    const dd = new DropDown({
      root: div,
      options: [
        { value: 'HSV', label: 'HSV' },
        { value: 'RGB', label: 'RGB' },
      ],
      publisher: colorSpace,
    });

    const c = document.createElement('div');
    div.appendChild(c);

    colorSpace.subscribe((space) => {
      this.picker?.destroy();

      if (space === 'HSV') {
        this.picker = new HueSatValuePicker({
          root: c,
          colorPublisher,
        });
      } else {
        //
      }
    });
  }
}

class HueSatValuePicker {
  inputs: Input[];
  hueSatCircleSlider: HueSatCircleSlider;
  valueSlider: ValueSlider;

  constructor({ root, colorPublisher }: {root: HTMLDivElement, colorPublisher: ColorPublisher}) {
    this.hueSatCircleSlider = new HueSatCircleSlider({
      root,
      colorPublisher,
    });

    this.valueSlider = new ValueSlider({
      root,
      colorPublisher,
    });

    const inputs = document.createElement('div');
    Object.assign(inputs.style, {
      display: 'flex',
      marginRight: '-8px',
    });

    this.inputs = ['hue', 'saturation', 'value'].map((k) => {
      const key = k as keyof HSVColor;

      return new Input({
        root: inputs,
        label: key.slice(0, 3),
        colorPublisher,
        key,
        format(a: number) {
          const rounded = Math.round(a);
          return String(key === 'hue' ? rounded % 360 : rounded);
        },
        parse: key === 'hue' ? hueParser : defaultParser,
        init() {
          const sub: Subscription<HSVColor> = (color) => {
            if (document.activeElement === this.inputElement) return;
            this.inputElement.value = this.format(color[key]);
          };

          colorPublisher.subscribe(sub);
          return () => {
            colorPublisher.unsubscribe(sub);
          };
        },
      });
    });

    root.appendChild(inputs);
  }

  destroy() {
    this.inputs.forEach((input) => input.destroy());
    this.valueSlider.destroy();
    this.hueSatCircleSlider.destroy();
  }
}

export { ColorPicker };
