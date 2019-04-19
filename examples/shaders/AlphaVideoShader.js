const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;
in vec3 normal;

in vec2 topUv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec2 vUv;
out vec3 vNormal;

void main() {
    vUv = topUv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tMap;

in vec2 vUv;
in vec3 vNormal;

out vec4 FragColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 rgbColor = texture(tMap, vUv).rgb;
    float alphaColor = texture(tMap, vUv - vec2(0, 0.5)).r;
    FragColor = vec4(rgbColor, alphaColor);
}
`;

export default {vertex, fragment};