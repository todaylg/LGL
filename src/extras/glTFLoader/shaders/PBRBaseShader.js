const vertex = `
precision highp float;
precision highp int;

in vec3 position;
#ifdef HAS_NORMALS
in vec3 normal;
#endif
#ifdef HAS_TANGENTS
in vec4 tangent;
#endif
#ifdef HAS_UV
in vec2 uv;
#endif

#ifdef USE_SKINNING
in vec4 skinIndex;
in vec4 skinWeight;

uniform sampler2D boneTexture;
uniform int boneTextureSize;

mat4 getBoneMatrix(const in float i) {
    float j = i * 4.0;
    float x = mod(j, float(boneTextureSize));
    float y = floor(j / float(boneTextureSize));

    float dx = 1.0 / float(boneTextureSize);
    float dy = 1.0 / float(boneTextureSize);

    y = dy * (y + 0.5);

    vec4 v1 = texture(boneTexture, vec2(dx * (x + 0.5), y));
    vec4 v2 = texture(boneTexture, vec2(dx * (x + 1.5), y));
    vec4 v3 = texture(boneTexture, vec2(dx * (x + 2.5), y));
    vec4 v4 = texture(boneTexture, vec2(dx * (x + 3.5), y));

    return mat4(v1, v2, v3, v4);
}
#endif


#ifdef HAS_MORPH_TARGETS
//support at least eight morphed attributes => 8 POSITION / 4 POSITION + 4 NORMAL / 2 POSITION + 2 NORMAL + 2TANGENT
uniform float TAR_WEIGHT[8];
in vec3 TAR_POSITION_0;
in vec3 TAR_POSITION_1;
in vec3 TAR_POSITION_2;
in vec3 TAR_POSITION_3;
in vec3 TAR_POSITION_4;
in vec3 TAR_POSITION_5;
in vec3 TAR_POSITION_6;
in vec3 TAR_POSITION_7;
#endif

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec2 vUv;
out vec3 vPosition;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
out mat3 vTBN;
#endif
out vec3 vNormal;
#endif

void main() {
    vec3 tPosition = position;
    #ifdef HAS_MORPH_TARGETS
        tPosition = position + 
        TAR_POSITION_0 * TAR_WEIGHT[0] +
        TAR_POSITION_1 * TAR_WEIGHT[1] + 
        TAR_POSITION_2 * TAR_WEIGHT[2] +
        TAR_POSITION_3 * TAR_WEIGHT[3] + 
        TAR_POSITION_4 * TAR_WEIGHT[4] +
        TAR_POSITION_5 * TAR_WEIGHT[5] + 
        TAR_POSITION_6 * TAR_WEIGHT[6] +
        TAR_POSITION_7 * TAR_WEIGHT[7];
    #endif

    vec4 pos = modelMatrix * vec4(tPosition,1.0);
    vPosition = vec3(pos.xyz) / pos.w;

    #ifdef HAS_NORMALS
    #ifdef HAS_TANGENTS
    vec3 normalW = normalize(vec3(normalMatrix * vec3(normal.xyz)));
    vec3 tangentW = normalize(vec3(modelMatrix * vec4(tangent.xyz, 0.0)));
    vec3 bitangentW = cross(normalW, tangentW) * tangent.w;
    vTBN = mat3(tangentW, bitangentW, normalW);
    #else
    vNormal = normalize(vec3(modelMatrix * vec4(normal.xyz, 0.0)));
    #endif
    #endif

    #ifdef HAS_UV
    vUv = uv;
    #else
    vUv = vec2(0.,0.);
    #endif

    #ifdef USE_SKINNING
    vNormal = normalize(normalMatrix * normal);
    mat4 boneMatX = getBoneMatrix(skinIndex.x);
    mat4 boneMatY = getBoneMatrix(skinIndex.y);
    mat4 boneMatZ = getBoneMatrix(skinIndex.z);
    mat4 boneMatW = getBoneMatrix(skinIndex.w);

    // update normal
    mat4 skinMatrix = mat4(0.0);
    skinMatrix += skinWeight.x * boneMatX;
    skinMatrix += skinWeight.y * boneMatY;
    skinMatrix += skinWeight.z * boneMatZ;
    skinMatrix += skinWeight.w * boneMatW;
    vNormal = vec4(skinMatrix * vec4(vNormal, 0.0)).xyz;

    // Update position
    vec4 Pos = vec4(tPosition, 1.0);
    vec4 transformed = skinMatrix * Pos;

    // vec4 transformed = vec4(0.0);
    // transformed += boneMatX * bindPos * skinWeight.x;
    // transformed += boneMatY * bindPos * skinWeight.y;
    // transformed += boneMatZ * bindPos * skinWeight.z;
    // transformed += boneMatW * bindPos * skinWeight.w;
    
    gl_Position = projectionMatrix * viewMatrix * transformed; //model already calculate in boneMatrix
    #else
    gl_Position = projectionMatrix * modelViewMatrix * vec4(tPosition, 1.0);
    #endif
}
`;

//
// This fragment shader defines a reference implementation for Physically Based Shading of
// a microfacet surface material defined by a glTF model.
//
// References:
// [1] Real Shading in Unreal Engine 4
//     http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
// [2] Physically Based Shading at Disney
//     http://blog.selfshadow.com/publications/s2012-shading-course/burley/s2012_pbs_disney_brdf_notes_v3.pdf
// [3] README.md - Environment Maps
//     https://github.com/KhronosGroup/glTF-WebGL-PBR/#environment-maps
// [4] "An Inexpensive BRDF Model for Physically based Rendering" by Christophe Schlick
//     https://www.cs.virginia.edu/~jdl/bib/appearance/analytic%20models/schlick94b.pdf

const fragment = `
precision highp float;
precision highp int;

in vec3 vPosition;
in vec2 vUv;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
in mat3 vTBN;
#else
in vec3 vNormal;
#endif
#endif

#ifdef USE_IBL
uniform sampler2D tLUT;
uniform samplerCube tEnvDiffuse;
uniform samplerCube tEnvSpecular;
#endif

#ifdef HAS_BASECOLORMAP
uniform sampler2D u_BaseColorSampler;
#endif
#ifdef HAS_NORMALMAP
uniform sampler2D u_NormalSampler;
uniform float u_NormalScale;
#endif
#ifdef HAS_EMISSIVEMAP
uniform sampler2D u_EmissiveSampler;
uniform vec3 u_EmissiveFactor;
#endif
#ifdef HAS_METALROUGHNESSMAP
uniform sampler2D u_MetallicRoughnessSampler;
#endif
#ifdef HAS_OCCLUSIONMAP
uniform sampler2D u_OcclusionSampler;
uniform float u_OcclusionStrength;
#endif

uniform vec2 u_MetallicRoughnessValues;
uniform vec4 u_BaseColorFactor;
uniform vec3 cameraPosition;

// Basic Param
uniform mat4 u_EnvRotationMat;
uniform float u_Alpha;
uniform float u_Brightness;
// Light
uniform vec3 u_LightDirection;
uniform vec3 u_LightColor;

mat3 environmentTransform;
const float PI = 3.14159265359;
const float RECIPROCAL_PI = 0.31830988618;
const float RECIPROCAL_PI2 = 0.15915494;
const float LN2 = 0.6931472;
const float ENV_LODS = 6.0;
const float c_MinRoughness = 0.04;

out vec4 FragColor;

// Color Space
vec4 SRGBtoLinear(vec4 srgb) {
    vec3 linOut = pow(srgb.xyz, vec3(2.2));
    return vec4(linOut, srgb.w);;
}
vec4 RGBMToLinear(in vec4 value) {
    float maxRange = 6.0;
    return vec4(value.xyz * value.w * maxRange, 1.0);
}
vec3 linearToSRGB(vec3 color) {
    return pow(color, vec3(1.0 / 2.2));
}
vec2 cartesianToPolar(vec3 n) {
    vec2 uv;
    uv.x = atan(n.z, n.x) * RECIPROCAL_PI2 + 0.5;
    uv.y = asin(n.y) * RECIPROCAL_PI + 0.5;
    return uv;
}

mat3 getEnvironmentTransfrom(mat4 transform) {
    vec3 x = vec3(transform[0][0], transform[1][0], transform[2][0]);
    vec3 y = vec3(transform[0][1], transform[1][1], transform[2][1]);
    vec3 z = vec3(transform[0][2], transform[1][2], transform[2][2]);
    mat3 m = mat3(x,y,z);
    return m;
}

// Find the normal for this fragment, pulling either from a predefined normal map
// or from the interpolated mesh normal and tangent attributes.
vec3 getNormal()
{
    // Retrieve the tangent space matrix
    #ifndef HAS_TANGENTS
        vec3 pos_dx = dFdx(vPosition);
        vec3 pos_dy = dFdy(vPosition);
        vec3 tex_dx = dFdx(vec3(vUv, 0.0));
        vec3 tex_dy = dFdy(vec3(vUv, 0.0));
        vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);

        #ifdef HAS_NORMALS
            vec3 ng = normalize(vNormal);
        #else
            vec3 ng = cross(pos_dx, pos_dy);
        #endif

        t = normalize(t - ng * dot(ng, t));
        vec3 b = normalize(cross(ng, t));
        mat3 tbn = mat3(t, b, ng);
    #else // HAS_TANGENTS
        mat3 tbn = vTBN;
    #endif

    #ifdef HAS_NORMALMAP
        vec3 n = texture(u_NormalSampler, vUv).rgb;
        n = normalize(tbn * ((2.0 * n - 1.0) * vec3(u_NormalScale, u_NormalScale, 1.0)));
    #else
        // The tbn matrix is linearly interpolated, so we need to re-normalize
        vec3 n = normalize(tbn[2].xyz);
    #endif

    return n;
}

// Calculation of the lighting contribution from an optional Image Based Light source.
// Precomputed Environment Maps are required uniform inputs and are computed as outlined in [1].
// See our README.md on Environment Maps [3] for additional discussion.
#ifdef USE_IBL
// TODO:
// void getIBLContribution(inout vec3 diffuse, inout vec3 specular, float NdotV, float roughness, vec3 n, vec3 reflection, vec3 diffuseColor, vec3 specularColor) {
//     vec3 brdf = SRGBtoLinear(texture(tLUT, vec2(NdotV, roughness))).rgb;
//     vec3 diffuseLight = RGBMToLinear(texture(tEnvDiffuse, cartesianToPolar(n))).rgb;
//     // Sample 2 levels and mix between to get smoother degradation
//     float blend = roughness * ENV_LODS;
//     float level0 = floor(blend);
//     float level1 = min(ENV_LODS, level0 + 1.0);
//     blend -= level0;
//     // Sample the specular env map atlas depending on the roughness value
//     vec2 uvSpec = cartesianToPolar(reflection);
//     uvSpec.y /= 2.0;

//     vec2 uv0 = uvSpec;
//     vec2 uv1 = uvSpec;

//     uv0 /= pow(2.0, level0);
//     uv0.y += 1.0 - exp(-LN2 * level0);

//     uv1 /= pow(2.0, level1);
//     uv1.y += 1.0 - exp(-LN2 * level1);

//     vec3 specular0 = RGBMToLinear(texture(tEnvSpecular, uv0)).rgb;
//     vec3 specular1 = RGBMToLinear(texture(tEnvSpecular, uv1)).rgb;
//     vec3 specularLight = mix(specular0, specular1, blend);

//     diffuse = diffuseLight * diffuseColor;

//     // Bit of extra reflection for smooth materials
//     float reflectivity = pow((1.0 - roughness), 2.0) * 0.05;
//     specular = specularLight * (specularColor * brdf.x + brdf.y + reflectivity);
//     specular *= uEnvSpecular;
// }
void getIBLContribution(inout vec3 diffuse, inout vec3 specular, float NdotV, float roughness, vec3 n, vec3 reflection, vec3 diffuseColor, vec3 specularColor)
{
    float mipCount = 9.0; // resolution of 512x512
    float lod = (roughness * mipCount);
    // retrieve a scale and bias to F0. See [1], Figure 3
    vec3 brdf = SRGBtoLinear(texture(tLUT, vec2(NdotV, 1.0 - roughness))).rgb;
    // CubeMap
    vec3 diffuseLight = SRGBtoLinear(texture(tEnvDiffuse, n)).rgb;
    // RGBM Texture
    // vec3 diffuseLight = RGBMToLinear(texture(tEnvDiffuse, cartesianToPolar(n))).rgb;
    vec3 R = environmentTransform * reflection;  
    #ifdef USE_TEX_LOD
    vec3 specularLight = SRGBtoLinear(textureCubeLodEXT(tEnvSpecular, R, lod)).rgb;
    #else
    vec3 specularLight = SRGBtoLinear(texture(tEnvSpecular, R)).rgb;
    #endif
    diffuse = diffuseLight * diffuseColor;
    specular = specularLight * (specularColor * brdf.x + brdf.y);
}
#endif


// Basic Lambertian diffuse
// Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
// See also [1], Equation 1
vec3 diffuse(vec3 diffuseColor)
{
    return diffuseColor / PI;
}

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
vec3 specularReflection(vec3 specularEnvR0, vec3 specularEnvR90, float VdotH) {
    return specularEnvR0 + (specularEnvR90 - specularEnvR0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}

// This calculates the specular geometric attenuation (aka G()),
// where rougher material will reflect less light back to the viewer.
// This implementation is based on [1] Equation 4.
float geometricOcclusion(float NdotL, float NdotV, float roughness) {
    float r = roughness;
    float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
    float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
    return attenuationL * attenuationV;
}

// The following equation(s) model the distribution of microfacet normals across the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes from EPIC Games [1], Equation 3.
float microfacetDistribution(float roughness, float NdotH) {
    float roughnessSq = roughness * roughness;
    float f = (NdotH * roughnessSq - NdotH) * NdotH + 1.0;
    return roughnessSq / (PI * f * f);
}

void main()
{
    environmentTransform = getEnvironmentTransfrom( u_EnvRotationMat );
    // The albedo may be defined from a base texture or a flat color
    #ifdef HAS_BASECOLORMAP
        vec4 baseColor = SRGBtoLinear(texture(u_BaseColorSampler, vUv)) * u_BaseColorFactor;
    #else
        vec4 baseColor = u_BaseColorFactor;
    #endif
  
    // Metallic and Roughness material properties are packed together
    // in glTF, these factors can be specified by fixed scalar values
    // or from a metallic-roughness map
    float roughness = u_MetallicRoughnessValues.y;
    float metallic = u_MetallicRoughnessValues.x;
    #ifdef HAS_METALROUGHNESSMAP
        // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
        // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
        vec4 mrSample = texture(u_MetallicRoughnessSampler, vUv);
        roughness = mrSample.g * roughness;
        metallic = mrSample.b * metallic;
    #endif
    roughness = clamp(roughness, c_MinRoughness, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);

    vec3 f0 = vec3(0.04);
    vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0) * (1.0 - metallic);
    vec3 specularColor = mix(f0, baseColor.rgb, metallic);
    // For typical incident reflectance range (between 4% to 100%) set the grazing reflectance to 100% for typical fresnel effect.
    // For very low reflectance range on highly diffuse objects (below 4%), incrementally reduce grazing reflecance to 0%.
    float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);
    float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
    vec3 specularEnvR0 = specularColor.rgb;
    vec3 specularEnvR90 = vec3(1.0, 1.0, 1.0) * reflectance90;

    vec3 N = getNormal();                             // Normal at surface point
    vec3 V = normalize(cameraPosition - vPosition);   // Vector from surface point to camera
    vec3 L = normalize(u_LightDirection);             // Vector from surface point to light
    vec3 H = normalize(L + V);                        // Half vector between both l and v
    vec3 reflection = -normalize(reflect(V, N));

    float NdotL = clamp(dot(N, L), 0.001, 1.0);
    float NdotV = clamp(abs(dot(N, V)), 0.001, 1.0);
    float NdotH = clamp(dot(N, H), 0.0, 1.0);
    float LdotH = clamp(dot(L, H), 0.0, 1.0);
    float VdotH = clamp(dot(V, H), 0.0, 1.0);

    // Calculate the shading terms for the microfacet specular shading model
    vec3 F = specularReflection(specularEnvR0, specularEnvR90, VdotH);
    float G = geometricOcclusion(NdotL, NdotV, roughness);
    float D = microfacetDistribution(roughness, NdotH);

    // Calculation of analytical lighting contribution
    vec3 diffuseContrib = (1.0 - F) * diffuse(diffuseColor);
    vec3 specContrib = F * G * D / (4.0 * NdotL * NdotV);

    // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
    vec3 color = NdotL * u_LightColor * (diffuseContrib + specContrib);

    // Get base alpha
    float alpha = baseColor.a;
    // Add lights spec to alpha for reflections on transparent surfaces (glass)
    alpha = max(alpha, max(max(specContrib.r, specContrib.g), specContrib.b));

    // Calculate IBL lighting
    vec3 diffuseIBL;
    vec3 specularIBL;
    // Calculate lighting contribution from image based lighting source (IBL)
    #ifdef USE_IBL
        getIBLContribution(diffuseIBL, specularIBL, NdotV, roughness, N, reflection, diffuseColor, specularColor);
        // Add IBL on top of color
        color += u_Brightness * (diffuseIBL + specularIBL);
    #else
    // Test
        color *= 2.0;
    #endif

    // Apply optional PBR terms for additional (optional) shading
    // AO Map
    #ifdef HAS_OCCLUSIONMAP
        float ao = texture(u_OcclusionSampler, vUv).r;
        color = mix(color, color * ao, u_OcclusionStrength);
    #endif
    // EmissiveMap
    #ifdef HAS_EMISSIVEMAP
        vec3 emissive = SRGBtoLinear(texture(u_EmissiveSampler, vUv)).rgb * u_EmissiveFactor;
        color += emissive;
    #endif

    // Convert to sRGB to display
    FragColor.rgb = linearToSRGB(color);
    // Apply u_Alpha uniform at the end to overwrite any specular additions on transparent surfaces
    FragColor.a = alpha * u_Alpha;
}

`;

export default {vertex, fragment};