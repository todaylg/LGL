import { blur13 } from '../../assets/js/fast-separable-gaussian-blur.js';

const fs = `#version 300 es
precision highp float;

uniform vec2 resolution;
uniform sampler2D tMap;
uniform vec2 direction;

in vec2 vUv;
out vec4 FragColor;

${blur13}

void main() {
   FragColor = blur13(tMap, vUv, resolution, direction);
}`;

export default fs;
