import { Pip, DragParams } from '../../pip';
import { ColorPublisher, Color } from '../../colorPublisher';
import {
  uneaseInOutSine,
  easeInOutSine,
  uneaseInQuad,
  easeInQuad,
  hsvToRgb,
} from '../../utils';
import Vec2 from '../../../../canvas/utils/vec2';

function uneaseAngle(angle: number) {
  const segments = Math.floor(angle / 60);
  const remainder = angle % 60;
  return (segments + uneaseInOutSine(remainder / 60)) * 60;
}

function easeAngle(angle: number) {
  const segments = Math.floor(angle / 60);
  const remainder = angle % 60;
  return (segments + easeInOutSine(remainder / 60)) * 60;
}

class HueSatPip extends Pip {
  colorPublisher: ColorPublisher;

  constructor({ root, colorPublisher }: {root: HTMLDivElement, colorPublisher: ColorPublisher}) {
    super({ root });
    this.colorPublisher = colorPublisher;
    this.init();
  }

  init(): void {
    Object.assign(this.position.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translateX(-50%)translateY(-50%)',
    });

    Object.assign(this.element.style, {
      height: '20px',
      width: '20px',
      background: 'black',
      borderRadius: '100%',
      boxShadow: '0 2px 3px -1px rgba(0,0,0,1), inset 0 2px 3px -1px rgba(255,255,255,.4)',
      cursor: 'pointer',
    });

    this.colorPublisher.subscribe(this.subscription);
  }

  subscription = ({ hsv: { hue, saturation, value } }: Color) => {
    const uneasedAngle = uneaseAngle(hue);

    const magnitude = uneaseInQuad(saturation / 100) *
      this.root.getBoundingClientRect().height / 2;

    const vec = new Vec2(1, 0).rotate(uneasedAngle * Math.PI / 180).times(magnitude);

    const { red, green, blue } = hsvToRgb({ hue, saturation, value });

    Object.assign(this.element.style, {
      transform: `translateX(${vec.x}px) translateY(${-vec.y}px)`,
      background: `rgb(${red},${green},${blue})`,
      // border: getBorderColor({ red, green, blue }),
    });
  };

  dragCallback(arg: DragParams) {
    const {
      rootBox: {
        height, width,
      }, mouse: { x, y },
    } = arg;

    const radius = height / 2;

    const center = new Vec2(width / 2, height / 2);
    const mouse = new Vec2(x, y);

    let dist = mouse.minus(center);
    dist = dist.times(
      Math.min(dist.magnitude, radius) / dist.magnitude,
    );

    const uneasedAngle = Math.atan2(dist.y, -dist.x) + Math.PI;
    let phi = easeAngle(uneasedAngle * 180 / Math.PI);

    const uneasedRadius = dist.magnitude / radius;
    let r = easeInQuad(uneasedRadius);

    if (Number.isNaN(phi)) {
      phi = 0;
    }

    if (Number.isNaN(r)) {
      r = 0;
    }

    this.colorPublisher.set('hsv', {
      hue: phi % 360,
      saturation: r * 100,
    });
  }

  destroy(): void {
    this.colorPublisher.unsubscribe(this.subscription);
  }
}

export { HueSatPip };
