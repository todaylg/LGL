const vertex = `
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;
in vec3 normal;


uniform mat4 worldMatrix;
uniform mat4 lightSpaceMatrix;

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

out vec3 vFragPos;

void main() {
    vFragPos = vec3(worldMatrix * vec4(position, 1.0));
    #ifdef USE_SKINNING
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

        // Update position
        vec4 transformed = skinMatrix * vec4(position, 1.0);
        gl_Position = lightSpaceMatrix * transformed; //model already calculate in boneMatrix
    #else
        gl_Position = lightSpaceMatrix * worldMatrix * vec4(position, 1.0);
    #endif
}
`;

const fragment = `
precision highp float;
precision highp int;

#ifdef POINT_SHADOW
uniform vec3 lightPos;
uniform float far;
#endif

in vec3 vFragPos;

void main() {
    #ifdef POINT_SHADOW
        // get distance between fragment and light source
        float lightDistance = length(vFragPos - lightPos);
        // map to [0;1] range by dividing by far_plane
        lightDistance = lightDistance / far;
        // write this as modified depth
        gl_FragDepth = lightDistance;
    #endif
    // gl_FragDepth = gl_FragCoord.z;
}
`;

export default {vertex, fragment};