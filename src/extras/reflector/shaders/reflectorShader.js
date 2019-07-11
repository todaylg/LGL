const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;


uniform sampler2D tDiffuse;
uniform mat4 textureMatrix;

out vec4 vUv;

void main() {
    vUv = textureMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform vec3 color;
uniform sampler2D tDiffuse;

in vec4 vUv;

out vec4 FragColor;

float blendOverlay( float base, float blend ) {
    return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );
}

vec3 blendOverlay( vec3 base, vec3 blend ) {
return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );
}

void main() {
    vec4 base = textureProj( tDiffuse, vUv );
    FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );
}
`;

export default {vertex, fragment};