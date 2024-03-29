import { ColorPublisher, Color } from '../../colorPublisher';
import { Pip } from '../../pip';
import { HueSatPip } from './hueSatPip';
import { GlslSlider } from '../../../glslSlider';
import fragScript from './fragment.glsl';

class HueSatCircleSlider extends GlslSlider<{'u_value': 'uniform1f'}> {
  pip: Pip;
  colorPublisher: ColorPublisher;

  constructor({ root, colorPublisher }: {root: HTMLElement, colorPublisher: ColorPublisher}) {
    super({ root, uniforms: { u_value: 'uniform1f' }, fragScript });

    this.colorPublisher = colorPublisher;

    this.init();
    this.pip = new HueSatPip({
      root: this.div,
      colorPublisher: this.colorPublisher,
    });
  }

  init(): void {
    Object.assign(this.div.style, {
      height: '200px',
      width: '200px',
      marginBottom: '24px',
    });
    Object.assign(this.canvas.style, {
      height: '100%',
      width: '100%',
      borderRadius: '100%',
    });

    this.colorPublisher.subscribe(this.subscription);
  }

  subscription = ({ hsv: { value } }: Color) => {
    this.render(
      { u_value: [value / 100] },
    );
  };

  destroy(): void {
    this.colorPublisher.unsubscribe(this.subscription);
  }
}

export { HueSatCircleSlider };
