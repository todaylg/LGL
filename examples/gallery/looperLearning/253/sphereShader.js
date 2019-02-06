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
uniform vec3 ambientLightColor;
float ambientStrength;

in vec2 vUv;
in vec3 vNormal;

out vec4 FragColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec4 tex = texture(tMap, vUv);
    
    vec3 ambient = ambientStrength * ambientLightColor;
    float shading = dot(normal, ambient) * 0.15;
    vec4 result = tex + shading;
    FragColor = vec4(vec3(result),1.0);
}
`;

export default {vertex, fragment};