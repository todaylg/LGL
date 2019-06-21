const fs = `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform vec3 defaultColor;
uniform float defaultOpacity;
uniform float luminosityThreshold;
uniform float smoothWidth;

in vec2 vUv;
out vec4 FragColor;

void main() {
    vec4 texel = texture( tMap, vUv );
	vec3 luma = vec3( 0.299, 0.587, 0.114 );
	float v = dot( texel.xyz, luma );
	vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );
	float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );//limit
    FragColor =  mix( outputColor, texel, alpha );
}`;

export default fs;