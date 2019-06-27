const vignette = `#version 300 es
// #define ESKIL 1

precision highp float;
uniform sampler2D tMap;

uniform float offset;
uniform float darkness;

in vec2 vUv;

out vec4 FragColor;

vec4 mainImage(const in vec4 inputColor, const in vec2 uv) {
	const vec2 center = vec2(0.5);
	vec3 color = inputColor.rgb;
	#ifdef ESKIL
		vec2 coord = (uv - center) * vec2(offset);
		color = mix(color, vec3(1.0 - darkness), dot(coord, coord));
	#else
		float d = distance(uv, center);
		color *= smoothstep(0.8, offset * 0.799, d * (darkness + offset));
	#endif
	return vec4(color, inputColor.a);
}

void main() {
  vec4 textureColor = texture( tMap, vUv );
  FragColor =  mainImage(textureColor, vUv);
}
`;

export default vignette;

