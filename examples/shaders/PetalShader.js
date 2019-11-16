const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;

in vec3 offset;
in vec3 random;

uniform float uTime;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void rotate2d(inout vec2 v, float a){
    mat2 m = mat2(cos(a), -sin(a), sin(a),  cos(a));
    v = m * v;
}

void main() {
    vUv = uv;
    // copy position so that we can modify the instances
    vec3 pos = position;
    // scale first
    pos *= 0.9 + random.y * 0.2;
    // rotate around y axis
    rotate2d(pos.xz, random.x * 6.28 + 4.0 * uTime * (random.y - 0.5));
    // rotate around x axis just to add some extra variation
    rotate2d(pos.zy, random.z * 0.5 * sin(uTime * random.x + random.z * 3.14));
    pos += offset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);;
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;
uniform float uTime;
in vec2 vUv;

out vec4 FragColor;
void main(void) {
    FragColor.rgb = 0.7 + 0.1 * sin(vUv.yxx + uTime) + vec3(0.2, 0.0, 0.1);
    FragColor.a = 1.0;
}
`;

export default {vertex, fragment};