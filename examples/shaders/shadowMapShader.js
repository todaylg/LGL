const vertex = `
precision highp float;
precision highp int;

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec3 vFragPos;
out vec3 vNormal;
out vec2 vUv;

#if NUM_SPOT_LIGHTS > 0
    uniform mat4 lightSpaceMatrix[ NUM_SPOT_LIGHTS ];
    out vec4 vFragPosLightSpace[ NUM_SPOT_LIGHTS ];
#endif

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vFragPos = vec3(modelMatrix * vec4(position, 1.0));
    vNormal = transpose(inverse(mat3(modelMatrix))) * normal;
    vUv = uv;
    #if NUM_SPOT_LIGHTS > 0
        for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
            vFragPosLightSpace[ i ] = lightSpaceMatrix[ i ] * vec4(vFragPos, 1.0);
        }
    #endif
}
`;

const fragment = `
precision highp float;
precision highp int;

in vec3 vFragPos;
in vec3 vNormal;
in vec2 vUv;

uniform float cameraNear;
uniform float cameraFar;

uniform vec3 cameraPosition;
uniform vec3 baseColor;
uniform vec3 ambientLightColor;
uniform float ambientStrength;
uniform vec3 lightColor;
uniform vec3 lightPos;

#if NUM_SPOT_LIGHTS > 0
    uniform sampler2D shadowMap[ NUM_SPOT_LIGHTS ];
    in vec4 vFragPosLightSpace[ NUM_SPOT_LIGHTS ];
#endif

float compareDepthTexture( sampler2D depths, vec2 uv, float compare ) {
    float depth = texture(depths, uv).r;
    return step(compare, depth);//in shadow => 0，out shadow => 1
}

float shadowMaskCalculation(sampler2D shadowMap, vec4 fragPosLightSpace, vec3 normalVal ,vec3 lightDirVal) {
    // Todo: Frustum Check
    // 执行透视除法
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    // 变换到[0,1]的范围以便和深度贴图的深度相比较(转换到Screen Space,Depth Texture在Screen Space)
    projCoords = projCoords * 0.5 + 0.5;
    float bias = max(0.05 * (1.0 - max(dot(normalVal, lightDirVal),0.)), 0.005);
    // 取得当前片元在光源视角下的深度
    projCoords.z -= bias;
    float shadow = 1.0;
    #ifdef SHADOWMAP_TYPE_PCF
        ivec2 textureSizeVal = textureSize(shadowMap, 0);
        vec2 texelSize = vec2(1 /textureSizeVal.x, 1 / textureSizeVal.y);
        for(int x = -1; x <= 1; ++x)
        {
            for(int y = -1; y <= 1; ++y)
            {
                float pcfDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * texelSize).r; 
                shadow += compareDepthTexture(shadowMap, projCoords.xy,  projCoords.z);
            }    
        }
        shadow /= 9.0;
    #else
        shadow = compareDepthTexture(shadowMap, projCoords.xy, projCoords.z);
    #endif

    return shadow;
}

out vec4 FragColor;

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

    float shadow = 1.0;
    // calculate shadow
    #if NUM_SPOT_LIGHTS > 0
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i++ ) {
        //融合多个灯光阴影（阴影内为0，外为1，累乘）
        shadow *= shadowMaskCalculation(shadowMap[i], vFragPosLightSpace[i], normal, lightDir);
    }
    #endif

    vec3 result = baseColor * (ambient + shadow * (diffuse + specular)) ;
    //Shadow Mask
    FragColor = vec4(result,1.0);
}
`;

export default {vertex, fragment};