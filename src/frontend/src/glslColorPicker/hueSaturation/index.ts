import fScript from './fragment.glsl';
import vScript from '../vertex.glsl';
import { createProgram, createShader } from '../utils';
import Vec2 from '../../canvas/utils/vec2';
import { ColorPublisher } from './colorPublisher';

function ease(x: number) {
  return (1 - Math.cos(x * Math.PI)) / 2;
}

function unease(x: number) {
  return Math.acos(1 - 2 * x) / Math.PI;
}

function uneaseAngle(angle: number) {
  const segments = Math.floor(angle / 60);
  const remainder = angle % 60;
  return (segments + unease(remainder / 60)) * 60;
}

function easeAngle(angle: number) {
  const segments = Math.floor(angle / 60);
  const remainder = angle % 60;
  return (segments + ease(remainder / 60)) * Math.PI / 3;
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

    const easedAngle = Math.atan2(dist.y, -dist.x) + Math.PI;
    const phi = uneaseAngle(easedAngle * 180 / Math.PI);
    const r = dist.magnitude / radius;

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
      const easedAngle = easeAngle(hue);
      const magnitude = saturation / 100 * this.root.getBoundingClientRect().height / 2;
      const vec = new Vec2(1, 0).rotate(easedAngle).times(magnitude);
      Object.assign(this.position.style, {
        transform: `translateX(${vec.x}px) translateY(${-vec.y}px)`,
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
      height: '10px',
      width: '10px',
      background: 'black',
      borderRadius: '100%',
      transform: 'translateX(-50%)translateY(-50%)',
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
