import { GlslSlider } from '../../../glslSlider';
import { ColorPublisher } from '../../colorPublisher';
import fragment from './fragment.glsl';
import { ValuePip } from './valuePip';
import { hsvToRgb } from '../../utils';

class ValueSlider extends GlslSlider<{
    'u_hue': 'uniform1f',
    'u_saturation': 'uniform1f'
}> {
  colorPublisher: ColorPublisher;

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
    const pip = new ValuePip({ root: this.div, colorPublisher });
  }

  init(): void {
    Object.assign(this.div.style, {
      height: '12px',
      width: '200px',
      marginBottom: '12px',
    });

    Object.assign(this.canvas.style, {
      height: '100%',
      width: '100%',
      borderRadius: '3px',
    });

    this.colorPublisher.subscribe((color) => {
      this.render({
        u_hue: [color.hue],
        u_saturation: [color.saturation / 100],
      });
    });
  }
}

export { ValueSlider };
