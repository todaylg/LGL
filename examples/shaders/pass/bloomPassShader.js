const fs = `#version 300 es
precision highp float;

#define NUM_MIPS 5

uniform sampler2D tMap;
uniform sampler2D blurTexture1;
uniform sampler2D blurTexture2;
uniform sampler2D blurTexture3;
uniform sampler2D blurTexture4;
uniform sampler2D blurTexture5;

uniform float bloomStrength;
uniform float bloomRadius;
uniform float bloomFactors[NUM_MIPS];
uniform vec3 bloomTintColors[NUM_MIPS];

float lerpBloomFactor(const in float factor) {
   float mirrorFactor = 1.2 - factor;
   return mix(factor, mirrorFactor, bloomRadius);
}

in vec2 vUv;
out vec4 FragColor;

void main() {
   vec4 bloom = vec4(0.);
   bloom += lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture(blurTexture1, vUv);
   bloom += lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture(blurTexture2, vUv);
   bloom += lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture(blurTexture3, vUv);
   bloom += lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture(blurTexture4, vUv);
   bloom += lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture(blurTexture5, vUv);
   bloom *= bloomStrength;
   FragColor = bloom;
}`;

export default fs;
