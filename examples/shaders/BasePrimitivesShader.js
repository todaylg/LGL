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

const vec3 baseColor = vec3(0.0,0.6,0.9);
const vec3 ambientLightColor = vec3(1.0,1.0,1.0);
const float ambientStrength = 0.3;
const vec3 lightColor = vec3(1.0,1.0,1.0);

in vec3 vNormal;
in vec3 FragPos;
out vec4 FragColor;
const vec3 lightPos = vec3(0.0, 10.0, 10.0);

void main() {
     vec3 ambient = ambientStrength * ambientLightColor;

    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightPos - FragPos);
    vec3 diffuse = lightColor * max(dot(normal, lightDir),0.0);
    
    // specular
    float specularStrength = 0.5;
    vec3 viewDir = normalize(-FragPos); // the viewer is always at (0,0,0) in view-space, so viewDir is (0,0,0) - Position => -Position
    vec3 halfwayDir = normalize(lightDir + viewDir);

    float spec = pow(max(dot(viewDir, halfwayDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColor; 

    vec3 result = baseColor * (diffuse + ambient + specular);
    FragColor = vec4(result, 1.0);
}
`;

export default {vertex, fragment};