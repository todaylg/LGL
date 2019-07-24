const emptyPixel = new Uint8Array(4);

function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}

let ID = 0;

/**
 * Create Texture
 * 
 * @class
 * @param {WebGLContext} gl 
 * @param {Object} [options] -  The optional texture parameters
 * @param {HTMLImageElement/HTMLCanvasElement/HTMLVideoElement/ImageBitmap/ImageData} [options.image] - image source
 * @param {GLenum} [options.target=gl.TEXTURE_2D] - A GLenum specifying the binding point (target) of the active texture
 * @param {GLenum} [options.type=gl.UNSIGNED_BYTE] - A GLenum specifying the data type of the texel(纹素) data.
 * @param {GLenum} [options.format=gl.RGBA]  -A GLenum specifying the format of the texel data（In WebGL 1, this must be the same as internalformat）
 * @param {GLenum} [options.internalFormat=format] - A GLenum specifying the color components in the texture.
 * @param {GLint} [options.level=0] - A GLint specifying the level of detail. Level 0 is the base image level and level n is the nth mipmap reduction level
 * @param {GLsizei} [options.width] - A GLsizei specifying the width of the texture.
 * @param {GLsizei} [options.height=width] - A GLsizei specifying the height of the texture.
 * @param {GLfloat/GLint} [options.wrapS=gl.CLAMP_TO_EDGE] - Param of TEXTURE_WRAP_S (texParameter)
 * @param {GLenum} [options.wrapT=gl.CLAMP_TO_EDGE] - Param of TEXTURE_WRAP_T (texParameter)
 * @param {Boolean} [options.generateMipmaps=true] - Whether generates a set of mipmaps
 * @param {GLfloat/GLint} [options.minFilter=generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR] - Param of  TEXTURE_MIN_FILTER (texParameter)
 * @param {GLfloat/GLint} [options.magFilter=gl.LINEAR] - Param of TEXTURE_MAG_FILTER (texParameter)
 * @param {Boolean} [options.premultiplyAlpha=false] - Param of UNPACK_PREMULTIPLY_ALPHA_WEBGL (pixelStorei)
 * @param {Boolean} [options.flipY=true] - Param of UNPACK_FLIP_Y_WEBGL (pixelStorei)
 */
export class Texture {
    constructor(gl, {
        image,
        images,
        target = gl.TEXTURE_2D,
        type = gl.UNSIGNED_BYTE,
        format = gl.RGBA,
        internalFormat = format,
        level = 0,
        width, // used for RenderTargets or Data Textures
        height = width,
        wrapS = gl.CLAMP_TO_EDGE,
        wrapT = gl.CLAMP_TO_EDGE,
        generateMipmaps = true,
        minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
        magFilter = gl.LINEAR,
        premultiplyAlpha = false,
        unpackAlignment = 4,
        flipY = true,
    } = {}) {
        this.gl = gl;
        this.id = ID++;
        this.images = images;
        this.image = image || (images && images[0]);
        this.target = target;
        this.type = type;
        this.format = format;
        this.internalFormat = internalFormat;
        this.level = level;
        this.width = width;
        this.height = height;
        this.minFilter = minFilter;
        this.magFilter = magFilter;
        this.wrapS = wrapS;
        this.wrapT = wrapT;
        this.generateMipmaps = generateMipmaps;
        this.premultiplyAlpha = premultiplyAlpha;
        this.unpackAlignment = unpackAlignment;
        this.flipY = flipY;
        this.texture = this.gl.createTexture();

        this.store = {
            image: null,
        };

        // Alias for state store to avoid redundant calls for global state
        this.glState = this.gl.renderer.state;

        // State store to avoid redundant calls for per-texture state
        this.state = {};
        this.state.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
        this.state.magFilter = this.gl.LINEAR;
        this.state.wrapS = this.gl.REPEAT;
        this.state.wrapT = this.gl.REPEAT;
    }
    /**
     * Bind to active texture unit
     */
    bind() {
        // Already bound to active texture unit
        if (this.glState.textureUnits[this.glState.activeTextureUnit] === this.id) return;
        this.gl.bindTexture(this.target, this.texture);
        this.glState.textureUnits[this.glState.activeTextureUnit] = this.id;
    }
    /**
     * Update the texture
     * 
     * @param {Number} [textureUnit=0] -  The textureUnit of update
     */
    update(textureUnit = 0) {
        const needsUpdate = !(this.image === this.store.image && !this.needsUpdate);

        // Make sure that texture is bound to its texture unit
         if (needsUpdate || this.glState.textureUnits[textureUnit] !== this.id) {
            this.gl.renderer.activeTexture(textureUnit);
            this.bind();
        }

        if (!needsUpdate) return;
        this.needsUpdate = false;

        if (this.flipY !== this.glState.flipY) {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
            this.glState.flipY = this.flipY;
        }

        if (this.premultiplyAlpha !== this.glState.premultiplyAlpha) {
            this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
            this.glState.premultiplyAlpha = this.premultiplyAlpha;
        }

        if (this.unpackAlignment !== this.glState.unpackAlignment) {
            this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this.unpackAlignment);
            this.glState.unpackAlignment = this.unpackAlignment;
        }

        if (this.minFilter !== this.state.minFilter) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
            this.state.minFilter = this.minFilter;
        }

        if (this.magFilter !== this.state.magFilter) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
            this.state.magFilter = this.magFilter;
        }

        if (this.wrapS !== this.state.wrapS) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
            this.state.wrapS = this.wrapS;
        }

        if (this.wrapT !== this.state.wrapT) {
            this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
            this.state.wrapT = this.wrapT;
        }

        if (this.image || this.images) {
            if (this.image && this.image.width) {
                this.width = this.image.width;
                this.height = this.image.height;
            }
            // CubeMap
            if (this.images && this.images.length === 6) {
                for (let i = 0; i < this.images.length; i++) {
                    if (this.gl.renderer.isWebgl2){
                        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.images[i]);
                    }else{
                        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.internalFormat, this.format, this.type, this.images[i]);
                    }
                }
            } else {
                // TODO: check is ArrayBuffer.isView is best way to check for Typed Arrays?
                if (this.gl.renderer.isWebgl2 || ArrayBuffer.isView(this.image)) {
                    this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0 /* border */, this.format, this.type, this.image);
                } else {
                    this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
                }
            }
            // TODO: support everything
            // WebGL1:
            // gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
            // gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
            // gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
            // gl.texImage2D(target, level, internalformat, format, type, HTMLCanvasElement? pixels);
            // gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
            // gl.texImage2D(target, level, internalformat, format, type, ImageBitmap? pixels);

            // WebGL2:
            // gl.texImage2D(target, level, internalformat, width, height, border, format, type, GLintptr offset);
            // gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLCanvasElement source);
            // gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLImageElement source);
            // gl.texImage2D(target, level, internalformat, width, height, border, format, type, HTMLVideoElement source);
            // gl.texImage2D(target, level, internalformat, width, height, border, format, type, ImageBitmap source);
            // gl.texImage2D(target, level, internalformat, width, height, border, format, type, ImageData source);
            // gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView srcData, srcOffset);

            if (this.generateMipmaps) {
                // For WebGL1, if not a power of 2, turn off mips, set wrapping to clamp to edge and minFilter to linear
                if (!this.gl.renderer.isWebgl2 && (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height))) {
                    this.generateMipmaps = false;
                    this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
                    this.minFilter = this.gl.LINEAR;
                } else {
                    this.gl.generateMipmap(this.target);
                }
            }
        } else {
            if (this.width) {
                // image intentionally left null for RenderTarget
                this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
            } else {
                // Upload empty pixel if no image to avoid errors while image or video loading
                this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
            }
        }
        this.store.image = this.image;
        this.onUpdate && this.onUpdate();
    }
}