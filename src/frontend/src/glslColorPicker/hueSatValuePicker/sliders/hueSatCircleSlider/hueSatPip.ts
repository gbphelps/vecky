import { Pip, DragParams } from '../../pip';
import { ColorPublisher } from '../../colorPublisher';
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
      height: 0,
      width: 0,
    });

    Object.assign(this.element.style, {
      height: '15px',
      width: '15px',
      background: 'black',
      borderRadius: '100%',
      transform: 'translateX(-50%)translateY(-50%)',
      border: '1px solid rgba(0,0,0,.3)',
    });

    this.colorPublisher.subscribe(({ hue, saturation }) => {
      const uneasedAngle = uneaseAngle(hue);

      const magnitude = uneaseInQuad(saturation / 100) *
        this.root.getBoundingClientRect().height / 2;

      const vec = new Vec2(1, 0).rotate(uneasedAngle * Math.PI / 180).times(magnitude);

      const { red, green, blue } = hsvToRgb({ hue, saturation, value: 100 });

      Object.assign(this.position.style, {
        transform: `translateX(${vec.x}px) translateY(${-vec.y}px)`,
      });
      Object.assign(this.element.style, {
        background: `rgb(${red},${green},${blue})`,
      });
    });
  }

  dragCallback(arg: DragParams) {
    const {
      rootBox: {
        height, width, top, left,
      }, mouse: { x, y },
    } = arg;

    const radius = height / 2;

    const center = new Vec2(left + width / 2, top + height / 2);
    const mouse = new Vec2(x, y);

    let dist = mouse.minus(center);
    dist = dist.times(
      Math.min(dist.magnitude, radius) / dist.magnitude,
    );

    const uneasedAngle = Math.atan2(dist.y, -dist.x) + Math.PI;
    const phi = easeAngle(uneasedAngle * 180 / Math.PI);

    const uneasedRadius = dist.magnitude / radius;
    const r = easeInQuad(uneasedRadius);

    this.colorPublisher.set({
      hue: phi,
      saturation: r * 100,
    });
  }
}

export { HueSatPip };
