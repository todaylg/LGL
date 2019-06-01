const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;
in vec3 normal;

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

uniform sampler2D tMap;

in vec2 vUv;
out vec4 FragColor;

void main() {
    vec3 tex = texture(tMap, vUv).rgb;
    FragColor.rgb = tex;
    FragColor.a = 1.0;
}
`;

export default {vertex, fragment};