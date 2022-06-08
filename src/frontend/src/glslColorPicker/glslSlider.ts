import vScript from './vertex.glsl';
import { createProgram, createShader } from './utils';
import { Pip } from './hueSatValuePicker/pip';

type UniformType = 'uniform1f' | 'uniform2f'

type UniformTuples = {
  uniform1f: [number],
  uniform2f: [number, number]
}

abstract class GlslSlider<T extends {[name: string]: UniformType}> {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  aPosition: number;
  div: HTMLDivElement;
  program: WebGLProgram;
  abstract pip: Pip;
  abstract destroy(): void;

  uniforms: T;
  locs: {[U in keyof T]: WebGLUniformLocation};

  constructor({ root, uniforms, fragScript }: {
      root: HTMLElement,
      uniforms: T,
      fragScript: string
    }) {
    this.uniforms = uniforms;
    this.div = document.createElement('div');

    const { destroy } = this;

    this.destroy = () => {
      destroy.call(this);
      this.destroyParent();
    };

    this.canvas = document.createElement('canvas');
    const gl = this.canvas.getContext('webgl');
    if (!gl) throw new Error('could not create context');
    this.gl = gl;

    Object.assign(this.div.style, { position: 'relative' });
    Object.assign(this.canvas.style, { display: 'block' });

    this.div.appendChild(this.canvas);

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vScript);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragScript);
    this.program = createProgram(gl, vertexShader, fragmentShader);

    const aPosition = gl.getAttribLocation(this.program, 'a_position');
    this.locs = this.initLocs();
    this.aPosition = aPosition;

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
    gl.useProgram(this.program);
  }

  initLocs() {
    return Object.keys(this.uniforms).reduce((acc, k) => {
      const key = k as keyof T;

      const loc = this.gl.getUniformLocation(this.program, key as string);
      if (!loc) throw new Error(`Could not find location of ${key}`);
      acc[key] = loc;
      return acc;
    }, {} as {[U in keyof T]: WebGLUniformLocation});
  }

  // eslint-disable-next-line no-undef
  render(value: {[Prop in keyof T]: UniformTuples[T[Prop]]}) {
    const {
      gl, aPosition, uniforms,
    } = this;

    Object.keys(this.uniforms).forEach((k) => {
      const key = k as keyof typeof uniforms;
      const type = this.uniforms[key];
      const loc = this.locs[key];

      const val = value[key];

      // @ts-ignore
      gl[type](loc, ...val);
    });

    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  destroyParent() {
    this.pip.destroy();
    this.div.parentElement?.removeChild(this.div);
  }
}

export { GlslSlider };
