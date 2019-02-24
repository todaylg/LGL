const vertex = `
uniform vec3 uResolution;
    attribute vec2 aPosition;
    varying vec2 texCoord;
    varying vec2 screenCoord;
    void main(void) {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        texCoord = aPosition.xy * 0.5 + vec2(0.5, 0.5);
        screenCoord = aPosition.xy * vec2(uResolution.z, 1.0);
    }
`;

const fragment = `
#ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif
    uniform sampler2D uSrc;
    uniform sampler2D uBloom;
    uniform vec2 uDelta;
    varying vec2 texCoord;
    varying vec2 screenCoord;
    void main(void) {
        vec4 srccol = texture2D(uSrc, texCoord) * 2.0;
        vec4 bloomcol = texture2D(uBloom, texCoord);
        vec4 col;
        col = srccol + bloomcol * (vec4(1.0) + srccol);
        col *= smoothstep(1.0, 0.0, pow(length((texCoord - vec2(0.5)) * 2.0), 1.2) * 0.5);
        col = pow(col, vec4(0.45454545454545)); //(1.0 / 2.2)
        
        gl_FragColor = vec4(col.rgb, 1.0);
        gl_FragColor.a = 0.01;//0.0不行，但是0.01可以
    }
`;

export default { vertex, fragment };