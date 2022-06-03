// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;
varying vec2 v_pos;
uniform float u_hue;
uniform float u_saturation;

vec4 getColor(float val) {
    float p = fract(val);

    if (val <= 1.0){
        return vec4(1.0, p, 0.0, 1.0);
    }

    if (val <= 2.0) {
        return vec4(1.0 - p, 1.0, 0.0, 1.0);
    }

    if (val <= 3.0) {
        return vec4(0.0, 1.0, p, 1.0);
    }

    if (val <= 4.0) {
        return vec4(0.0, 1.0-p, 1.0, 1.0);
    }

    if (val <= 5.0) {
        return vec4(p, 0.0, 1.0, 1.0);
    }

    return vec4(1.0, 0.0, 1.0-p, 1.0);
}

void main() {
  vec4 preValue = mix(vec4(1.0, 1.0, 1.0, 1.0), getColor(u_hue/60.0), u_saturation);
  
  float w = (v_pos.x + 1.0)/2.0;

  gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), preValue, w);
}