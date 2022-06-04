import { ColorPublisher } from '../../colorPublisher';
import { DragParams, Pip } from '../../pip';

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
      height: '15px',
      width: '15px',
      borderRadius: '100%',
      background: 'black',
    });

    this.colorPublisher.subscribe(({ value }) => {
      const p = value / 100;
      const { width } = this.root.getBoundingClientRect();
      Object.assign(this.element.style, {
        transform: `translateX(${width * p}px)`,
      });
    });
  }
}

export { ValuePip };
