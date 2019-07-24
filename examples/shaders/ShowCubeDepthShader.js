const vertex = `#version 300 es
precision highp float;
precision highp int;

in vec3 position;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec3 vPos;

void main() {
    vPos = (modelMatrix * vec4(position, 1.0)).xyz;
    // vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

uniform samplerCube cubeMap;
uniform float cameraNear;
uniform float cameraFar;

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


float readCubeDepth( samplerCube depthSampler, vec3 coord ) {
    float fragCoordZ = texture( depthSampler, coord ).r;// Screen Space
    fragCoordZ = fragCoordZ * 2.0 - 1.0; // Clip Space
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}

void main() {
    float depth = readCubeDepth(cubeMap, vPos);
    FragColor = vec4(depth,depth,depth,1.0);
}
`;

export default {vertex, fragment};
