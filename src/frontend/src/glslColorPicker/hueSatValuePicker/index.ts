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

  constructor({
    label, root, init, colorPublisher, key, format, parse,
  }:{
    label: string,
    root: HTMLElement,
    init: (this: Input) => void,
    colorPublisher: ColorPublisher,
    key: keyof HSVColor,
    format: (a:number) => string,
    parse: (a: string) => number,
  }) {
    this.key = key;
    this.colorPublisher = colorPublisher;
    this.format = format.bind(this);
    this.parse = parse.bind(this);

    const container = document.createElement('label');
    Object.assign(container.style, {
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

    root.appendChild(container);
    container.appendChild(labelElement);
    container.appendChild(inputElement);
    this.inputElement = inputElement;
    init.call(this);

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
}

class HueSatValuePicker {
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

    const dd = new DropDown({
      root: div,
      options: [
        { value: 'one', label: 'one' },
        { value: 'two', label: 'two' },
      ],
      publisher: new PubSub('one'),
    });

    const hueSat = new HueSatCircleSlider({
      root: div,
      colorPublisher,
    });

    const valueSlider = new ValueSlider({
      root: div,
      colorPublisher,
    });

    const inputs = document.createElement('div');
    Object.assign(inputs.style, {
      display: 'flex',
      marginRight: '-8px',
    });

    ['hue', 'saturation', 'value'].forEach((k) => {
      const key = k as keyof HSVColor;

      const input = new Input({
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
          colorPublisher.subscribe((color) => {
            if (document.activeElement === this.inputElement) return;
            this.inputElement.value = this.format(color[key]);
          });
        },
      });
    });

    div.appendChild(inputs);
  }
}

export { HueSatValuePicker };
