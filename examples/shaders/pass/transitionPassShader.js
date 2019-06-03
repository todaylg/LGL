const fs = `#version 300 es
precision highp float;

uniform float mixRatio;
uniform sampler2D tMap;
uniform sampler2D tPreMap;
uniform sampler2D tMixTexture;

uniform int useTexture;
uniform float threshold;

in vec2 vUv;
out vec4 FragColor;

void main() {
    vec4 texel1 = texture( tMap, vUv );
    vec4 texel2 = texture( tPreMap, vUv );
    if (useTexture==1) {
        vec4 transitionTexel = texture( tMixTexture, vUv );
        float r = mixRatio * (1.0 + threshold * 2.0) - threshold;
        float mixf=clamp((transitionTexel.r - r)*(1.0/threshold), 0.0, 1.0);
        FragColor = mix( texel1, texel2, mixf );
    } else {
        FragColor = mix( texel2, texel1, mixRatio );
    }
}`;

export default fs;