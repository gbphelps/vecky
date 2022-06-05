// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default. It means "medium precision"
precision mediump float;
varying vec2 v_pos;
uniform float u_value;
 
float pi = 3.14159265359;

float easeInOut(float x) {
    return (1.0-cos(x*pi))/2.0;
}

float easeIn(float x) {
return x * x;
}

vec4 getColor(float val) {
    float p = fract(val);

    if (val < 1.0){
        return vec4(1.0, easeInOut(p), 0.0, 1.0);
    }

    if (val < 2.0) {
        return vec4(easeInOut(1.0 - p), 1.0, 0.0, 1.0);
    }

    if (val < 3.0) {
        return vec4(0.0, 1.0, easeInOut(p), 1.0);
    }

    if (val < 4.0) {
        return vec4(0.0, easeInOut(1.0-p), 1.0, 1.0);
    }

    if (val < 5.0) {
        return vec4(easeInOut(p), 0.0, 1.0, 1.0);
    }

    return vec4(1.0, 0.0, easeInOut(1.0-p), 1.0);
}

void main() {
  // gl_FragColor is a special variable a fragment shader
  // is responsible for setting
  float angle = (atan(-1.0 * v_pos.y, -1.0 * v_pos.x) + pi)/(2.0 * pi) * 6.0;

  float r = length(v_pos.xy);

  vec4 preValue = mix(vec4(1.0, 1.0, 1.0, 1.0), getColor(angle), easeIn(r));

  gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), preValue, u_value);
}