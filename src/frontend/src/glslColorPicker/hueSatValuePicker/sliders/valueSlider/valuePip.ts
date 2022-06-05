import { ColorPublisher } from '../../colorPublisher';
import { DragParams, Pip } from '../../pip';
import { hsvToRgb, RGBColor } from '../../utils';

function getBorderColor({ red, green, blue }: RGBColor) {
  const v = ((0.299 * red + 0.587 * green + 0.114 * blue) / 255 - 0.5) * 2;

  if (v < 0) {
    return `1px solid rgba(255,255,255,${0.8})`;
  }
  return `1px solid rgba(0,0,0,${0.8})`;
}

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
      boxShadow: '0 2px 3px -1px rgba(0,0,0,1), inset 0 2px 3px -1px rgba(255,255,255,.4)',
    });

    this.colorPublisher.subscribe(({ hue, saturation, value }) => {
      const p = value / 100;
      const { width } = this.root.getBoundingClientRect();
      const { red, green, blue } = hsvToRgb({ hue, saturation, value });

      Object.assign(this.element.style, {
        background: `rgb(${red},${green},${blue})`,
        // border: getBorderColor({ red, green, blue }),
      });

      Object.assign(this.element.style, {
        transform: `translateX(${width * p}px)`,
      });
    });
  }
}

export { ValuePip };
