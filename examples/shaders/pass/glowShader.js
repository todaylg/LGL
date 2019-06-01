const vertex = `
precision highp float;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;

varying vec3 vPosition;

void main() {
  vPosition = position;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  
}`;

const fragment = `
precision highp float;

uniform float max;

varying vec3 vPosition;

void main() {
  float d = clamp(1.-length(vPosition)/max,0.,1.);
  d = pow(d,2.);
  gl_FragColor = vec4(1.,1.,1.,d);
}`;

export default { vertex, fragment };