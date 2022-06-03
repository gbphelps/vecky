import { GlslSlider } from '../../../glslSlider';
import { ColorPublisher } from '../../colorPublisher';
import fragment from './fragment.glsl';

class ValueSlider extends GlslSlider<{
    'u_hue': 'uniform1f',
    'u_saturation': 'uniform1f'
}> {
  colorPublisher: ColorPublisher;

  constructor({ root, colorPublisher }:{root: HTMLElement, colorPublisher: ColorPublisher}) {
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
  }

  init(): void {
    Object.assign(this.div.style, {
      height: '10px',
      width: '200px',
    });

    Object.assign(this.canvas.style, {
      height: '100%',
      width: '100%',
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
