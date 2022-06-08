import { ColorPublisher, HSVColor } from '../../colorPublisher';
import { DragParams, Pip } from '../../pip';
import { hsvToRgb } from '../../utils';

class ValuePip extends Pip {
  colorPublisher: ColorPublisher;
  constructor({ root, colorPublisher }: {root: HTMLDivElement, colorPublisher: ColorPublisher}) {
    super({ root });
    this.colorPublisher = colorPublisher;
    this.init();
  }

  dragCallback(args: DragParams) {
    const { rootBox: { width }, mouse: { x } } = args;

    const p = Math.max(0, Math.min(width, x)) / width;
    this.colorPublisher.set({
      value: p * 100,
    });
  }

  subscription = ({ hue, saturation, value }: HSVColor) => {
    const p = value / 100;
    const { width } = this.root.getBoundingClientRect();
    const { red, green, blue } = hsvToRgb({ hue, saturation, value });

    Object.assign(this.element.style, {
      background: `rgb(${red},${green},${blue})`,
    });

    Object.assign(this.element.style, {
      transform: `translateX(${width * p}px)`,
    });
  };

  init() {
    Object.assign(this.position.style, {
      position: 'absolute',
      top: '50%',
      left: '0%',
      transform: 'translateX(-50%)translateY(-50%)',
    });

    Object.assign(this.element.style, {
      height: '20px',
      width: '20px',
      borderRadius: '100%',
      background: 'black',
      boxShadow: '0 1px 2px rgba(0,0,0,.3)',
      cursor: 'pointer',
    });

    this.colorPublisher.subscribe(this.subscription);
  }

  destroy() {
    this.colorPublisher.unsubscribe(this.subscription);
  }
}

export { ValuePip };
