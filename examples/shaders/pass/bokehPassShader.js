const fs = `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tDepth;

uniform float aspect;
uniform float focus;
uniform float dof;
uniform float aperture;
uniform float maxBlur;

uniform float cameraNear;
uniform float cameraFar;

in vec2 vUv;
out vec4 FragColor;


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

// Perspective => Orthographic (Z-Value)
float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = texture( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}
vec4 calculateBokeh(const in vec4 inputColor, const in vec2 uv, const in float depth, sampler2D inputBuffer) {
	vec2 aspectCorrection = vec2(1.0, aspect);
	float focusNear = clamp(focus - dof, 0.0, 1.0);
	float focusFar = clamp(focus + dof, 0.0, 1.0);
	// Calculate a DoF mask.
	float low = step(depth, focusNear);
	float high = step(focusFar, depth);

	float factor = (depth - focusNear) * low + (depth - focusFar) * high;
	vec2 dofBlur = vec2(clamp(factor * aperture, -maxBlur, maxBlur));

	vec2 dofblur9 = dofBlur * 0.9;
	vec2 dofblur7 = dofBlur * 0.7;
	vec2 dofblur4 = dofBlur * 0.4;

	vec4 color = inputColor;
	color += texture(inputBuffer, uv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2( 0.15,  0.37) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2( 0.29,  0.29) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2(-0.37,  0.15) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2( 0.40,  0.0 ) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2( 0.37, -0.15) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2( 0.29, -0.29) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2(-0.15, -0.37) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2(-0.15,  0.37) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2(-0.29,  0.29) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2( 0.37,  0.15) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2(-0.37, -0.15) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2(-0.29, -0.29) * aspectCorrection) * dofBlur);
	color += texture(inputBuffer, uv + (vec2( 0.15, -0.37) * aspectCorrection) * dofBlur);

	color += texture(inputBuffer, uv + (vec2( 0.15,  0.37) * aspectCorrection) * dofblur9);
	color += texture(inputBuffer, uv + (vec2(-0.37,  0.15) * aspectCorrection) * dofblur9);
	color += texture(inputBuffer, uv + (vec2( 0.37, -0.15) * aspectCorrection) * dofblur9);
	color += texture(inputBuffer, uv + (vec2(-0.15, -0.37) * aspectCorrection) * dofblur9);
	color += texture(inputBuffer, uv + (vec2(-0.15,  0.37) * aspectCorrection) * dofblur9);
	color += texture(inputBuffer, uv + (vec2( 0.37,  0.15) * aspectCorrection) * dofblur9);
	color += texture(inputBuffer, uv + (vec2(-0.37, -0.15) * aspectCorrection) * dofblur9);
	color += texture(inputBuffer, uv + (vec2( 0.15, -0.37) * aspectCorrection) * dofblur9);

	color += texture(inputBuffer, uv + (vec2( 0.29,  0.29) * aspectCorrection) * dofblur7);
	color += texture(inputBuffer, uv + (vec2( 0.40,  0.0 ) * aspectCorrection) * dofblur7);
	color += texture(inputBuffer, uv + (vec2( 0.29, -0.29) * aspectCorrection) * dofblur7);
	color += texture(inputBuffer, uv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofblur7);
	color += texture(inputBuffer, uv + (vec2(-0.29,  0.29) * aspectCorrection) * dofblur7);
	color += texture(inputBuffer, uv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofblur7);
	color += texture(inputBuffer, uv + (vec2(-0.29, -0.29) * aspectCorrection) * dofblur7);
	color += texture(inputBuffer, uv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofblur7);

	color += texture(inputBuffer, uv + (vec2( 0.29,  0.29) * aspectCorrection) * dofblur4);
	color += texture(inputBuffer, uv + (vec2( 0.4,   0.0 ) * aspectCorrection) * dofblur4);
	color += texture(inputBuffer, uv + (vec2( 0.29, -0.29) * aspectCorrection) * dofblur4);
	color += texture(inputBuffer, uv + (vec2( 0.0,  -0.4 ) * aspectCorrection) * dofblur4);
	color += texture(inputBuffer, uv + (vec2(-0.29,  0.29) * aspectCorrection) * dofblur4);
	color += texture(inputBuffer, uv + (vec2(-0.4,   0.0 ) * aspectCorrection) * dofblur4);
	color += texture(inputBuffer, uv + (vec2(-0.29, -0.29) * aspectCorrection) * dofblur4);
	color += texture(inputBuffer, uv + (vec2( 0.0,   0.4 ) * aspectCorrection) * dofblur4);

	return color / 41.0;
}
void main() {
    vec4 color = texture( tMap, vUv );
	float depth = readDepth( tDepth, vUv );
    FragColor =  calculateBokeh(color, vUv, depth, tMap);
}


`;

export default fs;