const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 lightSpaceMatrix;

out vec3 vFragPos;
out vec3 vNormal;
out vec2 vUv;
out vec4 vFragPosLightSpace;


void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vFragPos = vec3(modelMatrix * vec4(position, 1.0));
    vNormal = transpose(inverse(mat3(modelMatrix))) * normal;
    vUv = uv;
    vFragPosLightSpace = lightSpaceMatrix * vec4(vFragPos, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

in vec3 vFragPos;
in vec3 vNormal;
in vec2 vUv;
in vec4 vFragPosLightSpace;

uniform vec3 cameraPosition;
uniform vec3 baseColor;
uniform vec3 ambientLightColor;
uniform float ambientStrength;
uniform vec3 lightColor;
uniform vec3 lightPos;

uniform sampler2D shadowMap;

out vec4 FragColor;

float shadowCalculation(vec4 fragPosLightSpace, vec3 normalVal ,vec3 lightDirVal) {
    // 执行透视除法
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // 变换到[0,1]的范围
    projCoords = projCoords * 0.5 + 0.5;
    // 取得最近点的深度(使用[0,1]范围下的fragPosLight当坐标)
    float closestDepth = texture(shadowMap, projCoords.xy).r; 
    // 取得当前片元在光源视角下的深度
    float currentDepth = projCoords.z;
    // 检查当前片元是否在阴影中
    // Method1:
    // float shadow = currentDepth > closestDepth  ? 1.0 : 0.0;
    // Method2:
    // float bias = max(0.05 * (1.0 - max(dot(normalVal, lightDirVal),0.)), 0.005);
    // float shadow = currentDepth - bias > closestDepth  ? 1.0 : 0.0;
    // Method3:
    float shadow = 0.0;
    float bias = max(0.05 * (1.0 - max(dot(normalVal, lightDirVal),0.)), 0.005);
    ivec2 textureSizeVal = textureSize(shadowMap, 0);
    vec2 texelSize = vec2(1 /textureSizeVal.x, 1 / textureSizeVal.y);
    for(int x = -1; x <= 1; ++x)
    {
        for(int y = -1; y <= 1; ++y)
        {
            float pcfDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * texelSize).r; 
            shadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0;        
        }    
    }
    shadow /= 9.0;

    return shadow;
}

void main() {
    vec3 ambient = ambientStrength * ambientLightColor;
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(lightPos - vFragPos);
    vec3 diffuse = lightColor * max(dot(normal, lightDir),0.0);
    
    // specular
    float specularStrength = 0.5;
    vec3 viewDir = normalize(cameraPosition-vFragPos);
    vec3 halfwayDir = normalize(lightDir + viewDir);

    float spec = pow(max(dot(viewDir, halfwayDir), 0.0), 32.0);
    vec3 specular = specularStrength * spec * lightColor; 

    // calculate shadow
    float shadow = shadowCalculation(vFragPosLightSpace, normal, lightDir);

    vec3 result = baseColor * (ambient + (1.0 - shadow) * (diffuse + specular));
    FragColor = vec4(result, 1.0);
}
`;

export default {vertex, fragment};