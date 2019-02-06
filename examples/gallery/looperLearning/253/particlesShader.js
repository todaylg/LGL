const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float size;

void main() {
    gl_PointSize = size;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tMap;
uniform vec3 baseColor;

out vec4 FragColor;

void main() {
    vec2 uv = gl_PointCoord.xy;
    vec4 tex = texture(tMap, uv);
    vec4 res = tex * vec4(baseColor,1.0);
    FragColor = res ;
}
`;

export default {vertex, fragment};