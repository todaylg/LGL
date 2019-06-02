import { Geometry } from '../core/Geometry.js';
import { Program } from '../core/Program.js';
import { Mesh } from '../core/Mesh.js';
import { RenderTarget } from '../core/RenderTarget.js';

/**
 * Create a Post Progressing
 * 
 * @class
 * @param {WebGLContext} gl
 * @param {Object} [options] -  The optional post parameters
 * @param {Number} [options.width] - The width of the canvas
 * @param {Number} [options.height] - The height of the canvas
 * @param {Number} [options.dpr] - The device pixel ratio of the post renderer, retina would be 2.
 * @param {Number} [options.wrapS = gl.REPEAT] - Param of TEXTURE_WRAP_S. (RenderTarget)
 * @param {Object} [options.wrapT = wrapS] - Param of TEXTURE_WRAP_T. (RenderTarget)
 * @param {Object} [options.minFilter = gl.LINEAR] - Param of  TEXTURE_MIN_FILTER. (RenderTarget)
 * @param {Object} [options.magFilter = minFilter] - Param of TEXTURE_MAG_FILTER. (RenderTarget)
 * @param {GLenum} [options.type] - A GLenum specifying the data type of the texel(纹素) data. (RenderTarget)
 * @param {GLenum} [options.format]  -A GLenum specifying the format of the texel data（In WebGL 1, this must be the same as internalformat）(RenderTarget)
 * @param {GLenum} [options.internalFormat] - A GLenum specifying the color components in the texture. (RenderTarget)
 */
export class Post {
    constructor(gl, {
        width,
        height,
        dpr,
        wrapS = gl.REPEAT,
        wrapT = wrapS,
        minFilter = gl.LINEAR,
        magFilter = minFilter,
        type,
        format,
        internalFormat
    } = {}) {
        this.gl = gl;
        this.options = { wrapS, wrapT, minFilter, magFilter, type, format, internalFormat };
        this.passes = [];
        // Triangle that covers viewport, with UVs that still span 0 > 1 across viewport
        this.geometry = new Geometry(gl, {
            position: { size: 3, data: new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]) },
            uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
        });
        this.resize({ width, height, dpr });
    }

    addPass({
        vertex = defaultVertex,
        fragment = defaultFragment,
        uniforms = {},
        textureUniform = 'tMap',
        enabled = true,
    } = {}) {
        uniforms[textureUniform] = { value: this.fbos[this.currentFBO] };
        const program = new Program(this.gl, { vertex, fragment, uniforms });
        const mesh = new Mesh(this.gl, { geometry: this.geometry, program });
        const pass = {
            mesh,
            program,
            uniforms,
            enabled,
            textureUniform,
        };
        this.passes.push(pass);
        return pass;
    }

    resize({ width, height, dpr } = {}) {
        if (dpr) this.dpr = dpr;
        if (width) {
            this.width = width;
            this.height = height || width;
        }
        dpr = this.dpr || this.gl.renderer.dpr;
        width = (this.width || this.gl.renderer.width) * dpr;
        height = (this.height || this.gl.renderer.height) * dpr;
        // TODO: Destroy render targets if size changed and exists
        this.options.width = width;
        this.options.height = height;
        this.fbo = new RenderTarget(this.gl, this.options);
        this.fbos = [this.fbo, this.fbo.clone()];
        this.currentFBO = 0;
    }

    // Uses same arguments as renderer.render
    render({
        scene,
        camera,
        target = null,
        update = true,
        sort = true,
        frustumCull = true,
    }) {
        const enabledPasses = this.passes.filter(pass => pass.enabled);
        // Render target first
        this.gl.renderer.render({
            scene,
            camera,
            target: enabledPasses.length ? this.fbos[this.currentFBO] : target,
            update, sort, frustumCull
        });
        if(!enabledPasses.length) return;
        // Render Pass
        enabledPasses.forEach((pass, i) => {
            pass.mesh.program.uniforms[pass.textureUniform].value = this.fbos[this.currentFBO]
            // 最后一个Render (i == enabledPasses.length - 1) 需要render回到main FrameBuffer
            this.gl.renderer.render({
                scene: pass.mesh,
                target: i === enabledPasses.length - 1 ? target : this.fbos[1 - this.currentFBO],
                clear: false,
            });
            this.currentFBO = 1 - this.currentFBO;
        });
       
    }
}

const defaultVertex = `#version 300 es
precision highp float;
precision highp int;

in vec2 uv;
in vec3 position;

out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
`;

const defaultFragment = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D tMap;
in vec2 vUv;
out vec4 FragColor;

void main() {
    FragColor = texture(tMap, vUv);
}
`;
