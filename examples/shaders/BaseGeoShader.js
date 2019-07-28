const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);;
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform vec3 baseColor;

out vec4 FragColor;
void main(void) {
    FragColor = vec4( baseColor, 1.0 );
}
`;

export default {vertex, fragment};
