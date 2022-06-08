import { GlslSlider } from '../../../glslSlider';
import { ColorPublisher, HSVColor } from '../../colorPublisher';
import fragment from './fragment.glsl';
import { ValuePip } from './valuePip';
import { hsvToRgb } from '../../utils';
import { Pip } from '../../pip';

class ValueSlider extends GlslSlider<{
    'u_hue': 'uniform1f',
    'u_saturation': 'uniform1f'
}> {
  colorPublisher: ColorPublisher;
  pip: Pip;

  constructor({ root, colorPublisher }:{root: HTMLDivElement, colorPublisher: ColorPublisher}) {
    super({
      root,
      uniforms: {
        u_hue: 'uniform1f',
        u_saturation: 'uniform1f',
      },
      fragScript: fragment,
    });

    this.colorPublisher = colorPublisher;

    this.init();
    this.pip = new ValuePip({ root: this.div, colorPublisher });
  }

  subscription = (color: HSVColor) => {
    this.render({
      u_hue: [color.hue],
      u_saturation: [color.saturation / 100],
    });
  };

  init(): void {
    Object.assign(this.div.style, {
      height: '12px',
      width: '200px',
      marginBottom: '12px',
      boxShadow: '0 1px 2px rgba(0,0,0,.3)',
      borderRadius: '3px',
    });

    Object.assign(this.canvas.style, {
      height: '100%',
      width: '100%',
      borderRadius: '3px',
    });

    this.colorPublisher.subscribe(this.subscription);
  }

  destroy() {
    this.colorPublisher.unsubscribe(this.subscription);
  }
}

export { ValueSlider };
