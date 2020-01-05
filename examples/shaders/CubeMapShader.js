const vertex = `
precision highp float;
precision highp int;

attribute vec2 uv;
attribute vec3 position;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

varying vec3 vUv;

void main() {
    vUv = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `
precision highp float;
precision highp int;
uniform mat4 u_EnvRotationMat;
uniform samplerCube cubeMap;
varying vec3 vUv;

mat3 environmentTransform;

mat3 getEnvironmentTransfrom( mat4 transform ) {
    vec3 x = vec3(transform[0][0], transform[1][0], transform[2][0]);
    vec3 y = vec3(transform[0][1], transform[1][1], transform[2][1]);
    vec3 z = vec3(transform[0][2], transform[1][2], transform[2][2]);
    mat3 m = mat3(x,y,z);
    return m;
}

void main() {
    environmentTransform = getEnvironmentTransfrom( u_EnvRotationMat );
    vec3 direction = normalize(vUv);
    direction = environmentTransform * direction;
    vec3 tex = textureCube(cubeMap, direction).rgb;
    gl_FragColor.rgb = tex;
    gl_FragColor.a = 1.0;
}
`;

export default {vertex, fragment};