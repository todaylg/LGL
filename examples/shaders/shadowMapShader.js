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

#if NUM_DIR_LIGHTS > 0
    uniform mat4 dirLightSpaceMatrix[ NUM_DIR_LIGHTS ];
    out vec4 dirFragPos[ NUM_DIR_LIGHTS ]; 
#endif

#if NUM_SPOT_LIGHTS > 0
    uniform mat4 spotLightSpaceMatrix[ NUM_SPOT_LIGHTS ];
    out vec4 spotFragPos[ NUM_SPOT_LIGHTS ]; 
#endif

#if NUM_POINT_LIGHTS > 0
    uniform mat4 pointLightSpaceMatrix[ NUM_POINT_LIGHTS ];
    out vec4 pointFragPos[ NUM_POINT_LIGHTS ]; 
#endif

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vFragPos = vec3(modelMatrix * vec4(position, 1.0));
    vNormal = transpose(inverse(mat3(modelMatrix))) * normal;
    vUv = uv;
    #if NUM_DIR_LIGHTS > 0
        for ( int i = 0; i < NUM_DIR_LIGHTS; i++ ) {
            dirFragPos[ i ] = dirLightSpaceMatrix[ i ] * vec4(vFragPos, 1.0);
        }
    #endif
    #if NUM_SPOT_LIGHTS > 0
        for ( int i = 0; i < NUM_SPOT_LIGHTS; i++ ) {
            spotFragPos[ i ] = spotLightSpaceMatrix[ i ] * vec4(vFragPos, 1.0);
        }
    #endif
    #if NUM_POINT_LIGHTS > 0
        for ( int i = 0; i < NUM_POINT_LIGHTS; i++ ) {
            pointFragPos[ i ] = pointLightSpaceMatrix[ i ] * vec4(vFragPos, 1.0);
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

uniform vec3 cameraPosition;
uniform vec3 baseColor;
uniform vec3 ambientLightColor;
uniform float ambientStrength;


uniform float cameraNear;
uniform float cameraFar;

#if NUM_DIR_LIGHTS > 0
    uniform sampler2D dirShadowMap[ NUM_DIR_LIGHTS ];
    in vec4 dirFragPos[ NUM_DIR_LIGHTS ];

    struct DirectionalLight {
		vec3 direction;
		vec3 lightColor;
        vec3 lightPos;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

#if NUM_SPOT_LIGHTS > 0
    uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];
    in vec4 spotFragPos[ NUM_SPOT_LIGHTS ];

    struct SpotLight {
        vec3 lightPos;
        vec3 direction;
		vec3 lightColor;
        float cutOff;
        float outerCutOff;
        float constant;
        float linear;
        float quadratic;
	};
    uniform SpotLight spotLights[ NUM_DIR_LIGHTS ];
#endif

#if NUM_POINT_LIGHTS > 0
    uniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];
    in vec4 pointFragPos[ NUM_POINT_LIGHTS ];
#endif

// Light Calulation
// calculates the color when using a directional light.
vec3 CalcDirLight(DirectionalLight light, vec3 normal)
{
    vec3 lightDir = normalize(-light.direction);
    // diffuse
    vec3 diffuse = 0.4 * max(dot(normal, lightDir),0.0) * light.lightColor;
    // specular
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 viewDir = normalize(cameraPosition - vFragPos);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = 0.5 * spec * light.lightColor; 

    return (diffuse + specular);
}
vec3 CalcSpotLight(SpotLight light, vec3 normal){
    vec3 viewDir = normalize(cameraPosition - vFragPos);
    vec3 lightDir = normalize(light.lightPos - vFragPos);
    // diffuse
    vec3 diffuse = 1.0 * max(dot(normal, lightDir),0.0) * light.lightColor;
    // specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = 1.0 * spec * light.lightColor;
    // attenuation
    float distance = length(light.lightPos - vFragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // spotlight intensity
    float theta = dot(lightDir, normalize(-light.direction)); 
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    // combine results
    diffuse *= attenuation * intensity;
    specular *= attenuation * intensity;
    return (diffuse + specular);
}
void CalcPointLight(){}
// Shadow Calulation
float compareDepthTexture( sampler2D depths, vec2 uv, float compare ) {
    float depth = texture(depths, uv).r;
    return step(compare, depth);//in shadow => 0，out shadow => 1
}

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
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

    bvec4 inFrustumVec = bvec4 ( projCoords.x >= 0.0, projCoords.x <= 1.0, projCoords.y >= 0.0, projCoords.y <= 1.0 );
	bool inFrustum = all( inFrustumVec );
	bvec2 frustumTestVec = bvec2( inFrustum, projCoords.z <= 1.0 );
	bool frustumTest = all( frustumTestVec );

    // if ( frustumTest )
    // Todo: GL_CLAMP_TO_EDGE => GL_CLAMP_TO_BORDER
    #ifdef SHADOWMAP_TYPE_PCF
        vec2 texelSize = 1.0 /vec2(textureSize(shadowMap, 0));
        for(int x = -1; x <= 1; ++x)
        {
            for(int y = -1; y <= 1; ++y)
            {
                float pcfDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * texelSize).r; 
                shadow += step(projCoords.z, pcfDepth);
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
    vec3 result = vec3(0.);
    float shadow = 1.0;
    #if NUM_DIR_LIGHTS > 0
        for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
            result = CalcDirLight(directionalLights[i], normal);
            result += ambient;
            vec3 lightDir = normalize(directionalLights[i].lightPos - vFragPos);
            shadow *= shadowMaskCalculation(dirShadowMap[i], dirFragPos[i], normal, lightDir);
        }
    #endif
    #if NUM_SPOT_LIGHTS > 0
        for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
            result += CalcSpotLight(spotLights[i], normal);
            vec3 lightDir = normalize(spotLights[i].lightPos - vFragPos);
            shadow *= shadowMaskCalculation(spotShadowMap[i], spotFragPos[i], normal, lightDir);
        }
    #endif
    //Shadow Mask
    result = baseColor * shadow * result;
    FragColor = vec4(result,1.0);
}
`;

export default {vertex, fragment};