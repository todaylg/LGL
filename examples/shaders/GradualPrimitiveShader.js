const vertex = `#version 300 es
precision highp float;
precision highp int;
in vec2 uv;
in vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
out vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;
uniform float uTime;
in vec2 vUv;
out vec4 FragColor;
void main() {
    FragColor.rgb = 0.5 + 0.3 * sin(vUv.yxx + uTime) + vec3(0.2, 0.0, 0.1);
    FragColor.a = 1.0;
}
`;

export default {vertex, fragment};