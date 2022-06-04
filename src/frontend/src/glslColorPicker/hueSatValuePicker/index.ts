import { ColorPublisher } from './colorPublisher';
import { HueSatCircleSlider } from './sliders/hueSatCircleSlider';
import { ValueSlider } from './sliders/valueSlider';

class HueSatValuePicker {
  colorPublisher: ColorPublisher;

  constructor({ root }: {root: HTMLElement}) {
    this.colorPublisher = new ColorPublisher();
    const div = document.createElement('div');
    Object.assign(div.style, {
      position: 'absolute',
      top: '12px',
      left: '12px',
      padding: '20px',
      background: 'white',
      border: '1px solid rgba(0,0,0,.1)',
      borderRadius: '3px',
    });
    root.appendChild(div);

    const hueSat = new HueSatCircleSlider({
      root: div,
      colorPublisher: this.colorPublisher,
    });
    const valueSlider = new ValueSlider({
      root: div,
      colorPublisher: this.colorPublisher,
    });
  }
}

export { HueSatValuePicker };
