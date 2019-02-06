const vertex = `#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 modelMatrix;
uniform mat3 normalMatrix;
uniform vec3 cameraPosition;

out vec3 e;
out vec3 n;
out vec3 vRefract;
out float rim;

void main() {
  e = normalize( vec3( modelViewMatrix * vec4( position, 1.0 ) ) );
  n = normalize( normalMatrix * normal );
  rim = pow(abs(dot(e,n)),2.);
  vec4 mPosition = modelMatrix * vec4( position, 1.0 );
  vec3 nWorld = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  vRefract = normalize( refract( normalize( mPosition.xyz - cameraPosition ), nWorld, .5 ) );
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}`;

const fragment = `#version 300 es
precision highp float;

uniform sampler2D tMap;

in float rim;
in vec3 e;
in vec3 n;
in vec3 vRefract;
out vec4 FragColor;

#define PI 3.1415926535897932384626433832795

void main() {
  float yaw = .5 - atan( vRefract.z, - vRefract.x ) / ( 2.0 * PI );
  float pitch = .5 - asin( vRefract.y ) / PI;
  vec3 envColor = texture( tMap, vec2( 1.-yaw, 1.-pitch ) ).rgb;
  FragColor = vec4(rim*envColor.xyz,1.5*rim);
}`;

export default {vertex, fragment};