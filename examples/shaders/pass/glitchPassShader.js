//based on staffantans glitch shader for unity https://github.com/staffantan/unityglitch

const fs = `#version 300 es
precision highp float;

uniform sampler2D tMap;
uniform sampler2D perturbationMap;

uniform float amount;
uniform float angle;
uniform float random;
uniform float seed_x;
uniform float seed_y;
uniform float distortion_x;
uniform float distortion_y;
uniform float col_s;

in vec2 vUv;
out vec4 FragColor;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 p = vUv;
    float xs = floor(gl_FragCoord.x / 0.5);
    float ys = floor(gl_FragCoord.y / 0.5);
    vec4 normal = texture (perturbationMap, p*random*random);
    if(p.y<distortion_x+col_s && p.y>distortion_x-col_s*random) {
        if(seed_x>0.){
            p.y = 1. - (p.y + distortion_y);
        }else {
            p.y = distortion_y;
        }
    }

    if(p.x<distortion_y+col_s && p.x>distortion_y-col_s*random) {
        if(seed_y>0.){
            p.x=distortion_x;
        }else {
            p.x = 1. - (p.x + distortion_x);
        }
    }

    p.x+=normal.x*seed_x*(random/5.);
    p.y+=normal.y*seed_y*(random/5.);

    //base from RGB shift shader
    vec2 offset = amount * vec2( cos(angle), sin(angle));
    vec4 cr = texture(tMap, p + offset);
    vec4 cga = texture(tMap, p);
    vec4 cb = texture(tMap, p - offset);
    FragColor = vec4(cr.r, cga.g, cb.b, cga.a);
    //add noise
    vec4 snow = 200.*amount*vec4(rand(vec2(xs * random,ys * random*50.))*0.2);
    FragColor = FragColor+ snow;
}
`;

export default fs;
