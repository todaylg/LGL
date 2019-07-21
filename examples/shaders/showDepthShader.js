const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;
in vec3 normal;

uniform mat4 modelMatrix;
uniform mat4 lightSpaceMatrix;

void main() {
    gl_Position = lightSpaceMatrix * modelMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tMap;
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
    float fragCoordZ = texture( depthSampler, coord ).r;
    fragCoordZ = fragCoordZ * 2.0 - 1.0; // Clip Space
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
    // orthographic
    // float depth = texture(tMap, vUv).r;
    // FragColor.rgb = 1.0 - vec3( depth );
    // FragColor.a = 1.0;

    //perspective
    float depth = readDepth( tMap, vUv );
    FragColor.rgb = 1.0 - vec3( depth );
    FragColor.a = 1.0;
}
`;

export default {vertex, fragment};