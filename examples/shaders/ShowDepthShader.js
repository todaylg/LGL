const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tMap;
// uniform samplerCube tMap;
uniform float cameraNear;
uniform float cameraFar;

in vec2 vUv;
in vec3 vPos;

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

float unpackRGBA (vec4 v) {
    return dot(v, 1.0 / vec4(1.0, 255.0, 65025.0, 16581375.0));
}

// Perspective => Orthographic (Z-Value)
float readDepth( sampler2D depthSampler, vec2 coord ) {
    float fragCoordZ = unpackRGBA(texture( depthSampler, coord ));
    fragCoordZ = fragCoordZ * 2.0 - 1.0; // Clip Space
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

float readCubeDepth( samplerCube depthSampler, vec3 coord ) {
    float fragCoordZ = unpackRGBA(texture( depthSampler, coord ));// Screen Space
    fragCoordZ = fragCoordZ * 2.0 - 1.0; // Clip Space
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
    // orthographic
    float depth = unpackRGBA(texture(tMap, vUv));
    FragColor.rgb = 1.0 - vec3( depth );
    FragColor.a = 1.0;

    // perspective
    // float depth = readDepth( tMap, vUv );
    // FragColor.rgb = 1.0 - vec3( depth );
    // FragColor.a = 1.0;

    // CubeMap
    // float depth = readCubeDepth( tMap, vPos );
    // FragColor.rgb = 1.0 - vec3( depth );
    // FragColor.a = 1.0;
}
`;

export default {fragment};
