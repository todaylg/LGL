const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

in vec2 vUv;

uniform sampler2D tMap;
uniform sampler2D tDepth;
uniform float cameraNear;
uniform float cameraFar;

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

out vec4 FragColor;

void main() {
    //vec3 diffuse = texture( tDiffuse, vUv ).rgb;
    float depth = readDepth( tDepth, vUv );
    FragColor.rgb = 1.0 - vec3( depth );
    FragColor.a = 1.0;
}
`;

export default {vertex, fragment};