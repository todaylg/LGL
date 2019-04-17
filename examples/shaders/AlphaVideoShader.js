const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec2 vUv;
out vec3 vNormal;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tMap;
uniform vec2 topUv;

in vec2 vUv;
in vec3 vNormal;

out vec4 FragColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec4 tex = texture(tMap, topUv);

    FragColor = vec4(vec3(tex),1.0);
    //gl_FragColor = vec4(texture2D(u_sampler, v_texcoord).rgb, texture2D(u_sampler, v_texcoord+ vec2(-0.5, 0)).r);+ // 设置对应坐标的色值
}
`;

export default {vertex, fragment};