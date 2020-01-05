const vertex = `
precision highp float;
precision highp int;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vUv;

void main() {
    vUv = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `
precision highp float;
precision highp int;
uniform samplerCube cubeMap;
varying vec3 vUv;
void main() {
    vec3 tex = textureCube(cubeMap, vUv).rgb;
    gl_FragColor.rgb = tex;
    gl_FragColor.a = 1.0;
}
`;

export default {vertex, fragment};