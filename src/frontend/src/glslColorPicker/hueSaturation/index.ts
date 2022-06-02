import fScript from './fragment.glsl';
import vScript from '../vertex.glsl';
import { createProgram, createShader } from '../utils';
import Vec2 from '../../canvas/utils/vec2';
import { ColorPublisher, HSVColor } from './colorPublisher';

function ease(x: number) {
  return (1 - Math.cos(x * Math.PI)) / 2;
}

function unease(x: number) {
  return Math.acos(1 - 2 * x) / Math.PI;
}

function easeRadius(x: number) {
  return x * x;
}

function uneaseRadius(x: number) {
  return Math.sqrt(x);
}

function uneaseAngle(angle: number) {
  const segments = Math.floor(angle / 60);
  const remainder = angle % 60;
  return (segments + unease(remainder / 60)) * 60;
}

function easeAngle(angle: number) {
  const segments = Math.floor(angle / 60);
  const remainder = angle % 60;
  return (segments + ease(remainder / 60)) * 60;
}

function hueToRgb(hue: number) {
  const val = hue / 60;
  const p = val % 1;

  let color = { red: 0, green: 0, blue: 0 };

  if (val <= 1 || val === 6) {
    color = { red: 1, green: p, blue: 0 };
  } else if (val <= 2) {
    color = { red: 1 - p, green: 1, blue: 0 };
  } else if (val <= 3) {
    color = { red: 0, green: 1, blue: p };
  } else if (val <= 4) {
    color = { red: 0, green: 1 - p, blue: 1 };
  } else if (val <= 5) {
    color = { red: p, green: 0, blue: 1 };
  } else {
    color = { red: 1, green: 0, blue: (1 - p) };
  }

  return {
    red: 255 * color.red,
    green: 255 * color.green,
    blue: 255 * color.blue,
  };
}

function lerp(a: number, b: number, w: number) {
  return a + (b - a) * w;
}

function hsvToRgb({ hue, saturation, value }: HSVColor) {
  const baseColorRgb = hueToRgb(hue);

  Object.keys(baseColorRgb).forEach((k) => {
    const key = k as keyof typeof baseColorRgb;
    baseColorRgb[key] = lerp(
      0,
      lerp(255, baseColorRgb[key], saturation / 100),
      value / 100,
    );
  });

  return baseColorRgb;
}

class Pip {
  element: HTMLDivElement;
  position: HTMLDivElement;
  root: HTMLDivElement;
  colorPublisher: ColorPublisher;

  onMouseMove = (e: MouseEvent) => {
    const {
      height, width, top, left,
    } = this.root.getBoundingClientRect();

    const radius = height / 2;

    const center = new Vec2(left + width / 2, top + height / 2);
    const mouse = new Vec2(e.x, e.y);

    let dist = mouse.minus(center);
    dist = dist.times(
      Math.min(dist.magnitude, radius) / dist.magnitude,
    );

    const uneasedAngle = Math.atan2(dist.y, -dist.x) + Math.PI;
    const phi = easeAngle(uneasedAngle * 180 / Math.PI);

    const uneasedRadius = dist.magnitude / radius;
    const r = easeRadius(uneasedRadius);

    this.colorPublisher.set({
      hue: phi,
      saturation: r * 100,
    });
  };

  constructor({ root, colorPublisher }: {root: HTMLDivElement, colorPublisher: ColorPublisher}) {
    this.position = document.createElement('div');
    this.element = document.createElement('div');
    this.root = root;
    this.colorPublisher = colorPublisher;

    colorPublisher.subscribe(({ hue, saturation }) => {
      const uneasedAngle = uneaseAngle(hue);

      const magnitude = uneaseRadius(saturation / 100) *
      this.root.getBoundingClientRect().height / 2;

      const vec = new Vec2(1, 0).rotate(uneasedAngle * Math.PI / 180).times(magnitude);
      Object.assign(this.position.style, {
        transform: `translateX(${vec.x}px) translateY(${-vec.y}px)`,
      });

      const { red, green, blue } = hsvToRgb({ hue, saturation, value: 100 });

      Object.assign(this.element.style, {
        background: `rgb(${red},${green},${blue})`,
      });
    });

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

    root.appendChild(this.position);
    this.position.appendChild(this.element);

    this.element.addEventListener('mousedown', () => {
      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', this.onMouseMove);
      }, { once: true });
    });
  }
}

class ColorPicker {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  aPosition: number;
  uValue: WebGLUniformLocation;
  div: HTMLDivElement;
  pip: Pip;
  colorPublisher: ColorPublisher;

  constructor({ root }: {root: HTMLElement}) {
    this.div = document.createElement('div');
    this.canvas = document.createElement('canvas');
    const gl = this.canvas.getContext('webgl');
    if (!gl) throw new Error('could not create context');
    this.gl = gl;
    this.colorPublisher = new ColorPublisher();

    Object.assign(this.div.style, {
      height: '200px',
      width: '200px',
      position: 'absolute',
      top: '10px',
      left: '10px',
    });
    Object.assign(this.canvas.style, {
      height: '100%',
      width: '100%',
      borderRadius: '100%',
    });
    this.div.appendChild(this.canvas);

    this.pip = new Pip({
      root: this.div,
      colorPublisher: this.colorPublisher,
    });

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vScript);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fScript);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const aPosition = gl.getAttribLocation(program, 'a_position');
    const uValue = gl.getUniformLocation(program, 'u_value');
    if (uValue == null) throw new Error('could not find uValue');

    this.aPosition = aPosition;
    this.uValue = uValue;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1, 1,
      -1, -1,
      1, 1,

      1, 1,
      -1, -1,
      1, -1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    root.appendChild(this.div);
    gl.useProgram(program);
    this.render(1);
  }

  render = (value: number) => {
    const { gl, aPosition, uValue } = this;

    gl.uniform1f(uValue, value);
    gl.enableVertexAttribArray(aPosition);

    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
}

export default ColorPicker;
