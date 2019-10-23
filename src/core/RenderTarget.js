// TODO: multi target rendering
// TODO: test stencil and depth
// TODO: destroy
import { Texture } from './Texture.js';

/**
 * Create RenderTarget
 * 
 * @class
 * @param {WebGLContext} gl 
 * @param {Object} [options] -  The optional renderTarget parameters
 * @param {Number} [options.width=canvas.width] - The width of renderTarget
 * @param {Number} [options.height=canvas.height] - The height of renderTarget
 * @param {GLenum} [options.target=gl.FRAMEBUFFER] - A GLenum specifying the binding point (target), Collection buffer data storage of color, alpha, depth and stencil buffers used to render an image.
 * @param {Number} [options.color=1] - Number of color attachments
 * @param {Boolean} [options.depth=true] - Specifying the internal format of the renderbuffer is DEPTH_COMPONENT16 or not
 * @param {Boolean} [options.stencil=false] - Specifying the internal format of the renderbuffer is STENCIL_INDEX8 or not
 * @param {Boolean} [options.stencil=false] - Whether is depth textures (note depth textures break stencil - so can't use together)depthTexture = false, // note - stencil breaks
 * @param {GLenum} [options.type=gl.UNSIGNED_BYTE] - A GLenum specifying the data type of the texel(纹素) data.
 * @param {GLenum} [options.format=gl.RGBA]  -A GLenum specifying the format of the texel data（In WebGL 1, this must be the same as internalformat）
 * @param {GLenum} [options.internalFormat=format] - A GLenum specifying the color components in the texture.
 */
export class RenderTarget {
    constructor(gl, {
        width = gl.canvas.width,
        height = gl.canvas.height,
        target = gl.FRAMEBUFFER,
        color = 1,
        depth = true,
        stencil = false,
        depthTexture = false, // note - stencil breaks
        wrapS = gl.CLAMP_TO_EDGE,
        wrapT = gl.CLAMP_TO_EDGE,
        minFilter = gl.LINEAR,
        magFilter = minFilter,
        type = gl.UNSIGNED_BYTE,
        format = gl.RGBA,
        internalFormat = format,
        unpackAlignment,
        premultiplyAlpha,
        cubeMapFlag,
    } = {}) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.buffer = this.gl.createFramebuffer();
        this.target = target;
        this.gl.bindFramebuffer(this.target, this.buffer);
        this.textures = [];
        // create and attach required num of color textures
        // framebufferTexture2D / framebufferRenderbuffer
        for (let i = 0; i < color; i++) {
            this.textures.push(new Texture(gl, {
                width, height, wrapS, wrapT, minFilter, magFilter, type, format, internalFormat, unpackAlignment, premultiplyAlpha,
                flipY: false,
                generateMipmaps: false,
            }));
            this.textures[i].update();
            // Todo : Mutiple Render Target
            this.gl.framebufferTexture2D(this.target, this.gl.COLOR_ATTACHMENT0 + i, this.gl.TEXTURE_2D, this.textures[i].texture, 0 /* level */);
        }

        // alias for majority of use cases
        this.texture = this.textures[0];
        // depth and stencil
        // note depth textures break stencil - so can't use together
        // (https://www.khronos.org/registry/webgl/extensions/WEBGL_depth_texture/)
        if (depthTexture && (this.gl.renderer.isWebgl2 || this.gl.renderer.getExtension('WEBGL_depth_texture'))) {
            this.depthTexture = new Texture(gl, {
                width, height, wrapS, wrapT,
                target: cubeMapFlag ? gl.TEXTURE_CUBE_MAP: gl.TEXTURE_2D,
                minFilter: this.gl.NEAREST,
                magFilter: this.gl.NEAREST,
                flipY: false,
                format: this.gl.DEPTH_COMPONENT,
                internalFormat: gl.renderer.isWebgl2 ? this.gl.DEPTH_COMPONENT24 : this.gl.DEPTH_COMPONENT,
                type: this.gl.UNSIGNED_INT,
                generateMipmaps: false,
            });
            if(cubeMapFlag){
                // Render Depth Info To Cube Map
                this.depthTexture.images = [null, null, null, null, null, null];
                this.depthTexture.update();
            }else{
                this.depthTexture.update();
                this.gl.framebufferTexture2D(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.texture, 0);
            }
            // Not Need Color Write
            this.gl.drawBuffers([this.gl.NONE]);
            this.gl.readBuffer(this.gl.NONE);
        } else {
            // Renderbuffer Object
            if (depth && !stencil) {
                this.depthBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
                this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBuffer);
            }

            if (stencil && !depth) {
                this.stencilBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.stencilBuffer);
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.STENCIL_INDEX8, width, height);
                this.gl.framebufferRenderbuffer(this.target, this.gl.STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.stencilBuffer);
            }

            if (depth && stencil) {
                this.depthStencilBuffer = this.gl.createRenderbuffer();
                this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthStencilBuffer);
                this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, width, height);
                this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.depthStencilBuffer);
            }
        }
        if (this.gl.checkFramebufferStatus(this.target) != this.gl.FRAMEBUFFER_COMPLETE){
            console.error("checkFramebufferStatus no complete");
        }
        // 解绑，在renderer中再进行绑定
        this.gl.bindFramebuffer(this.target, null);
    }
    clone() {
        return new RenderTarget(this.gl, this);
    }
}