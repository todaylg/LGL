const vertex = `#version 300 es
precision highp float;
precision highp int;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uScale;
uniform sampler2D tNoise;


in vec3 positionStart;
in float startTime;
in vec3 velocity;
in float turbulence;
in vec3 color;
in float size;
in float lifeTime;

out vec4 vColor;
out float lifeLeft;

void main() {
    vColor = vec4( color, 1.0 );
    vec3 newPosition;
    vec3 v;

    float timeElapsed = uTime - startTime;
    lifeLeft = 1.0 - ( timeElapsed / lifeTime );

    gl_PointSize = ( uScale * size ) * lifeLeft; // scale fllow lifeLeft => 0
    v.x = ( velocity.x - 0.5 ) * 3.0;
    v.y = ( velocity.y - 0.5 ) * 3.0;
    v.z = ( velocity.z - 0.5 ) * 3.0;

    newPosition = positionStart + ( v * 10.0 ) * timeElapsed;
    // noise texture for turbulence
    vec3 noise = texture( tNoise, vec2( newPosition.x * 0.015 + ( uTime * 0.05 ), newPosition.y * 0.02 + ( uTime * 0.015 ) ) ).rgb;
    vec3 noiseVel = ( noise.rgb - 0.5 ) * 30.0;
    
    newPosition = mix( newPosition, newPosition + vec3( noiseVel * ( turbulence * 5.0 ) ), ( timeElapsed / lifeTime ) );

    if( v.y > 0. && v.y < .05 ) {
        lifeLeft = 0.0;
    }
    if( v.x < - 1.45 ) {
        lifeLeft = 0.0;
    }
    if( timeElapsed > 0.0 ) {
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
    }else{
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
        lifeLeft = 0.;
        gl_PointSize = 0.;
    }
}
`;

const fragment = `#version 300 es
precision highp float;
precision highp int;

float scaleLinear( float value, vec2 valueDomain ) {
    return (value - valueDomain.x ) / ( valueDomain.y - valueDomain.x);
}
float scaleLinear( float value, vec2 valueDomain, vec2 valueRange ) {
    return mix(valueRange.x, valueRange.y, scaleLinear( value, valueDomain));
}

in vec4 vColor;
in float lifeLeft;

uniform sampler2D tSprite;

out vec4 FragColor;

void main() {
    float alpha = 0.;
    if( lifeLeft > 0.995 ) {
        alpha = scaleLinear( lifeLeft, vec2( 1.0, 0.995 ), vec2( 0.0, 1.0 ) );
    }else{
        alpha = lifeLeft * 0.75;
    }
    vec4 tex = texture( tSprite, gl_PointCoord );
    FragColor = vec4( vColor.rgb * tex.a, alpha * tex.a );
}
`;

export default {vertex, fragment};