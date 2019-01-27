const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec3 position;
in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 vNormal;
out vec3 FragPos;

void main() {
    vNormal = normalize(normalMatrix * normal);
    FragPos = vec3(modelMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;
uniform vec3 baseColor;

in vec3 vNormal;
in vec3 FragPos;
out vec4 FragColor;
const vec3 lightPos = vec3(0.0, 3.0, 3.0);
const vec3 ambientColor = vec3(0.3, 0.3, 0.3);
const vec3 lightColor = vec3(1.0, 1.0, 1.0);

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightPos - FragPos);
    vec3 diffuse = lightColor * max(dot(normal, lightDir),0.0);
    vec3 result = baseColor * (diffuse+ambientColor);
    FragColor = vec4(result, 1.0);
}
`;

export default {vertex, fragment};