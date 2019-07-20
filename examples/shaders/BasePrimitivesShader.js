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
out vec3 vFragPos;

void main() {
    vNormal = normalize(normalMatrix * normal);
    vFragPos = vec3(modelMatrix * vec4(position, 1.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform vec3 cameraPosition;

uniform vec3 baseColor;
uniform vec3 ambientLightColor;
uniform float ambientStrength;

in vec3 vNormal;
in vec3 vFragPos;

struct DirectionalLight {
    vec3 target;
    vec3 lightColor;
    vec3 lightPos;
    float diffuseFactor;
    float specularFactor;
};
uniform DirectionalLight directionalLight;

vec3 CalcDirLight(DirectionalLight light, vec3 normal, vec3 ambient)
{
    vec3 lightDir = normalize(light.lightPos - light.target);
    // diffuse
    vec3 diffuse = light.diffuseFactor  * max(dot(normal, lightDir),0.0) * light.lightColor;
    // specular
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 viewDir = normalize(cameraPosition - vFragPos);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = light.specularFactor * spec * light.lightColor; 

    return (ambient + diffuse + specular);
}

out vec4 FragColor;

void main() {
    vec3 ambient = ambientStrength * ambientLightColor;
    vec3 normal = normalize(vNormal);
    
    vec3 result = CalcDirLight(directionalLight, normal, ambient) * baseColor;
    FragColor = vec4(result, 1.0);
}
`;

export default {vertex, fragment};