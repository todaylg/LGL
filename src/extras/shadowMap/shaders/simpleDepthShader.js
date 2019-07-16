const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;
in vec3 normal;

uniform mat4 worldMatrix;
uniform mat4 lightSpaceMatrix;

void main() {
    gl_Position = lightSpaceMatrix * worldMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es

void main() {
    // gl_FragDepth = gl_FragCoord.z;
}
`;

export default {vertex, fragment};