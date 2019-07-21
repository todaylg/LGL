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

 struct DirectionalLight {
    vec3 target;
    vec3 lightColor;
    vec3 lightPos;
    float diffuseFactor;
    float specularFactor;
};

struct SpotLight {
    vec3 lightPos;
    vec3 target;
    vec3 lightColor;
    float lightCameraNear;
    float lightCameraFar;
    float cutOff;
    float outerCutOff;
    float constant;
    float linear;
    float quadratic;
    float diffuseFactor;
    float specularFactor;
};

struct PointLight {
    vec3 lightPos;
    vec3 lightColor;
    float constant;
    float linear;
    float quadratic;

    float diffuseFactor;
    float specularFactor;
};

#if NUM_DIR_LIGHTS > 0
    uniform sampler2D dirShadowMap[ NUM_DIR_LIGHTS ];
    in vec4 dirFragPos[ NUM_DIR_LIGHTS ];

	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
#endif

#if NUM_SPOT_LIGHTS > 0
    uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHTS ];
    in vec4 spotFragPos[ NUM_SPOT_LIGHTS ];
    
    uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
#endif

#if NUM_POINT_LIGHTS > 0
    uniform sampler2D pointShadowMap[ NUM_POINT_LIGHTS ];
    in vec4 pointFragPos[ NUM_POINT_LIGHTS ];

    uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
#endif

// Light Calulation
vec3 CalcDirLight(DirectionalLight light, vec3 normal){
    vec3 lightDir = normalize(light.lightPos - light.target);
    // diffuse
    vec3 diffuse = light.diffuseFactor * max(dot(normal, lightDir),0.0) * light.lightColor;
    // specular
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 viewDir = normalize(cameraPosition - vFragPos);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = light.specularFactor * spec * light.lightColor;

    return (diffuse + specular);
}
vec3 CalcSpotLight(SpotLight light, vec3 normal){
    vec3 lightDir = normalize(light.lightPos - vFragPos);
    // diffuse
    vec3 diffuse = light.diffuseFactor * max(dot(normal, lightDir),0.0) * light.lightColor;
    // specular
    vec3 reflectDir = reflect(-lightDir, normal);
    vec3 viewDir = normalize(cameraPosition - vFragPos);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = light.specularFactor * spec * light.lightColor;
    // attenuation
    float distance = length(light.lightPos - vFragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // spotlight intensity
    float theta = dot(lightDir, normalize(light.lightPos - light.target));
    float epsilon = light.cutOff - light.outerCutOff;
    float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);
    // combine results
    diffuse *= attenuation * intensity;
    specular *= attenuation * intensity;
    return (diffuse + specular);
}
vec3 CalcPointLight(PointLight light, vec3 normal){
    vec3 viewDir = normalize(cameraPosition - vFragPos);
    vec3 lightDir = normalize(light.lightPos - vFragPos);
    // diffuse
    vec3 diffuse = light.diffuseFactor * max(dot(normal, lightDir),0.0) * light.lightColor;
    // specular
    vec3 reflectDir = reflect(-lightDir, normal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
    vec3 specular = light.specularFactor * spec * light.lightColor;
    // attenuation
    float distance = length(light.lightPos - vFragPos);
    float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));    
    // combine results
    diffuse *= attenuation;
    specular *= attenuation;
    return (diffuse + specular);
}

// Projection <=> View
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float linearClipZ, const in float near, const in float far ) {
	return linearClipZ * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * invClipZ - far );
}
float readOrthoDepth( sampler2D depthSampler, vec2 coord ) {
    float depth = texture(depthSampler, coord).r;
    return depth;
}
float readPerspectiveDepth( sampler2D depthSampler, vec2 coord, float near, float far ) {
    // Screen Space => Clip Space => View Space
    float fragCoordZ = texture(depthSampler, coord).r; // Screen Space
    float z = fragCoordZ * 2.0 - 1.0; // Clip Space
    float viewZ = perspectiveDepthToViewZ(z, near, far);
    viewZ = viewZToOrthographicDepth(viewZ, near, far);
    return viewZ;
}
float compareDepthTexture( float depth, float viewDepth ) {
    return step(viewDepth, depth);//in shadow => 0，out shadow => 1
}

// Shadow Calulation
float dirShadowMaskCal(sampler2D shadowMap, vec4 fragPosLightSpace, DirectionalLight light, vec3 normalVal) {
    vec3 lightDirVal = normalize(light.lightPos - vFragPos);
    // View Space => Screen Space (depthTexture data is Screen Space)
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    projCoords = projCoords * 0.5 + 0.5;
    float bias = max(0.05 * (1.0 - max(dot(normalVal, lightDirVal),0.)), 0.005);
    // Get current fragment depth
    projCoords.z -= bias;
    float shadow = 0.0;

    bvec4 inFrustumVec = bvec4 ( projCoords.x >= 0.0, projCoords.x <= 1.0, projCoords.y >= 0.0, projCoords.y <= 1.0 );
	bool inFrustum = all( inFrustumVec );
	bvec2 frustumTestVec = bvec2( inFrustum, projCoords.z <= 1.0 );
	bool frustumTest = all( frustumTestVec );

    // if ( frustumTest ){
        //  Todo: GL_CLAMP_TO_EDGE => GL_CLAMP_TO_BORDER
         #ifdef SHADOWMAP_TYPE_PCF
            vec2 texelSize = 1.0 /vec2(textureSize(shadowMap, 0));
            for(int x = -1; x <= 1; ++x)
            {
                for(int y = -1; y <= 1; ++y)
                {
                    float pcfDepth = 0.0;
                    pcfDepth = readOrthoDepth(shadowMap, projCoords.xy + vec2(x, y) * texelSize); 
                    shadow += compareDepthTexture(pcfDepth, projCoords.z);
                }    
            }
            shadow /= 9.0;
        #else
            shadow = compareDepthTexture(readOrthoDepth(shadowMap, projCoords.xy), projCoords.z);
        #endif
    // }
    return shadow;
}
float spotShadowMaskCal(sampler2D shadowMap, vec4 fragPosLightSpace, SpotLight light, vec3 normalVal) {
    vec3 lightDirVal = normalize(light.lightPos - vFragPos);
    float clipSpaceDepth = fragPosLightSpace.z / fragPosLightSpace.w;

    // Clip Space => View Space
    float linearDepth = perspectiveDepthToViewZ(fragPosLightSpace.z/fragPosLightSpace.w, light.lightCameraNear, light.lightCameraFar);
    linearDepth = viewZToOrthographicDepth(linearDepth, light.lightCameraNear, light.lightCameraFar);
    // Clip Space => Screen Space
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    projCoords = projCoords * 0.5 + 0.5;

    float bias = max(0.05 * (1.0 - max(dot(normalVal, lightDirVal),0.)), 0.005);
    linearDepth -= bias;

    float shadow = 0.0;
    #ifdef SHADOWMAP_TYPE_PCF
        vec2 texelSize = 1.0 /vec2(textureSize(shadowMap, 0));
        for(int x = -1; x <= 1; ++x)
        {
            for(int y = -1; y <= 1; ++y)
            {
                float pcfDepth = 0.0;
                pcfDepth = readPerspectiveDepth(shadowMap, projCoords.xy + vec2(x, y) * texelSize, light.lightCameraNear, light.lightCameraFar); 
                shadow += compareDepthTexture(pcfDepth, linearDepth);
            }    
        }
        shadow /= 9.0;
    #else
        shadow = compareDepthTexture(readPerspectiveDepth(shadowMap, projCoords.xy, light.lightCameraNear, light.lightCameraFar), linearDepth); 
    #endif

    return shadow;
}
void pointShadowMaskCalculation(sampler2D shadowMap){
    vec2 texelSize = 1.0 /vec2(textureSize(shadowMap, 0));
}

out vec4 FragColor;

void main() {
    vec3 ambient = ambientStrength * ambientLightColor;
    vec3 normal = normalize(vNormal);
    vec3 result = vec3(0.);
    float shadow = 0.0;
    #if NUM_DIR_LIGHTS > 0
        vec3 perDirLightRes = vec3(0.);
        for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
            perDirLightRes = CalcDirLight(directionalLights[i], normal);
            shadow = dirShadowMaskCal(dirShadowMap[i], dirFragPos[i], directionalLights[i], normal);
            result += perDirLightRes * shadow;
        }
    #endif
    #if NUM_SPOT_LIGHTS > 0
        vec3 perSpotLightRes = vec3(0.);
        for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
            perSpotLightRes = CalcSpotLight(spotLights[i], normal);
            shadow = spotShadowMaskCal(spotShadowMap[i], spotFragPos[i], spotLights[i], normal);
            result += perSpotLightRes * shadow;
        }
    #endif
    #if NUM_POINT_LIGHTS > 0
        // vec3 perPointLightRes = vec3(0.);
        // for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
        //     perPointLightRes = CalcPointLight(pointLights[i], normal);
        //     vec3 lightDir = normalize(pointLights[i].lightPos - vFragPos);
        //     shadow = shadowMaskCalculation(pointShadowMap[i], pointFragPos[i], normal, lightDir, false);
        //     result += perPointLightRes * shadow;
        // }
    #endif
    //Shadow Mask
    result = baseColor * (ambient + result);
    FragColor = vec4(result, 1.0);
}
`;

export default {vertex, fragment};