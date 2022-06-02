// an attribute will receive data from a buffer
attribute vec4 a_position;
varying vec2 v_pos;
 
// all shaders have a main function
void main() {
 
  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
  v_pos = vec2(a_position.xy);
}