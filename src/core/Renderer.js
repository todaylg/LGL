import { Vec3 } from "../math/Vec3.js";

const tempVec3 = new Vec3();

/**
 * Create webgl renderer
 * 
 * @class
 * @param {Object} [options] -  The optional renderer parameters
 * @param {HTMLCanvasElement} [options.canvas] -  The canvas to use get webgl renderer
 * @param {Number} [options.width] - The width of the canvas
 * @param {Number} [options.height] - The height of the canvas
 * @param {Number} [options.dpr=1] - The device pixel ratio of the renderer, retina would be 2.
 * @param {Boolean} [options.alpha=false] - Boolean that indicates if the canvas contains an alpha buffer
 * @param {Boolean} [options.depth=true] - Boolean that indicates that the drawing buffer has a depth buffer of at least 16 bits
 * @param {Boolean} [options.stencil=false] - Boolean that indicates that the drawing buffer has a stencil buffer of at least 8 bits
 * @param {Boolean} [options.antialias=false] - Boolean that indicates whether or not to perform anti-aliasing
 * @param {Boolean} [options.premultipliedAlpha=false] - Boolean that indicates that the page compositor will assume the drawing buffer contains colors with pre-multiplied alpha
 * @param {Boolean} [options.premultipliedAlpha=false] - Boolean that indicates that the page compositor will assume the drawing buffer contains colors with pre-multiplied alpha
 * @param {Boolean} [options.preserveDrawingBuffer=false] - If the value is true the buffers will not be cleared and will preserve their values until cleared or overwritten by the author
 * @param {Boolean} [options.powerPreference='default'] - A hint to the user agent indicating what configuration of GPU is suitable for the WebGL context
 * @param {Boolean} [options.autoClear=true] - Whether to clear the buffer before drawing each frame
 * @param {Number} [options.webgl=2] - Level of WebGL renderer to get
 * @example
 * new Renderer({dpr: 2})
 */
export class Renderer {
  constructor({
    canvas = document.createElement("canvas"),
    width = 300,
    height = 150,
    dpr = 1,
    alpha = false,
    depth = true,
    stencil = false,
    antialias = false,
    premultipliedAlpha = false,
    preserveDrawingBuffer = false,
    powerPreference = "default",
    autoClear = true,
    webgl = 2
  } = {}) {
    const attributes = {
      alpha,
      depth,
      stencil,
      antialias,
      premultipliedAlpha,
      preserveDrawingBuffer,
      powerPreference
    };
    this.dpr = dpr;
    this.alpha = alpha;
    this.color = true;
    this.depth = depth;
    this.stencil = stencil;
    this.premultipliedAlpha = premultipliedAlpha;
    this.autoClear = autoClear;

    // Attempt WebGL2, otherwise fallback to WebGL1
    if (webgl === 2) this.gl = canvas.getContext("webgl2", attributes);
    this.isWebgl2 = !!this.gl;
    if (!this.gl) {
      this.gl =
        canvas.getContext("webgl", attributes) ||
        canvas.getContext("experimental-webgl", attributes);
    }

    // Attach renderer to gl so that all classes have access to internal state functions
    this.gl.renderer = this;

    // initialise size values
    this.setSize(width, height);

    // Store device parameters
    this.parameters = {};
    this.parameters.maxTextureUnits = this.gl.getParameter(
      this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
    );

    // gl state stores to avoid redundant calls on methods used internally
    this.state = {};
    this.state.blendFunc = { src: this.gl.ONE, dst: this.gl.ZERO };
    this.state.blendEquation = { modeRGB: this.gl.FUNC_ADD };
    this.state.cullFace = null;
    this.state.frontFace = this.gl.CCW;
    this.state.depthMask = true;
    this.state.depthFunc = this.gl.LESS;
    this.state.premultiplyAlpha = false;
    this.state.flipY = false;
    this.state.unpackAlignment = 4;
    this.state.framebuffer = null;
    this.state.viewport = { width: null, height: null };
    this.state.textureUnits = [];
    this.state.activeTextureUnit = 0;
    this.state.boundBuffer = null;
    this.state.uniformLocations = new Map();

    // store requested extensions
    this.extensions = {};

    if (this.isWebgl2) {
      this.getExtension('EXT_color_buffer_float');
      this.getExtension('OES_texture_float_linear');
    } else {
      // Initialise extra format types
      this.getExtension("OES_texture_float");
      this.getExtension("OES_texture_float_linear");
      this.getExtension("OES_texture_half_float");
      this.getExtension('OES_texture_half_float_linear');
      this.getExtension("OES_element_index_uint");
      this.getExtension("OES_standard_derivatives");
      this.getExtension("EXT_sRGB");
      this.getExtension("WEBGL_depth_texture");
    }
    this.drawBuffersExt = this.getExtension('WEBGL_draw_buffers');//drawBuffers is Editor's Draft status in WebGL2
    // Create method aliases using extension (WebGL1) or native if available (WebGL2)
    this.vertexAttribDivisor = this.getExtension(
      "ANGLE_instanced_arrays",
      "vertexAttribDivisor",
      "vertexAttribDivisorANGLE"
    );
    this.drawArraysInstanced = this.getExtension(
      "ANGLE_instanced_arrays",
      "drawArraysInstanced",
      "drawArraysInstancedANGLE"
    );
    this.drawElementsInstanced = this.getExtension(
      "ANGLE_instanced_arrays",
      "drawElementsInstanced",
      "drawElementsInstancedANGLE"
    );
    this.createVertexArray = this.getExtension(
      "OES_vertex_array_object",
      "createVertexArray",
      "createVertexArrayOES"
    );
    this.bindVertexArray = this.getExtension(
      "OES_vertex_array_object",
      "bindVertexArray",
      "bindVertexArrayOES"
    );
    this.deleteVertexArray = this.getExtension(
      "OES_vertex_array_object",
      "deleteVertexArray",
      "deleteVertexArrayOES"
    );
  }
  /**
   * Set canvas's size from option's width/height and dpr parameter
   * 
   * @param {Number} width - Class reference
   * @param {Number} height - Class reference
   */
  setSize(width, height) {
    this.width = width;
    this.height = height;

    this.gl.canvas.width = width * this.dpr;
    this.gl.canvas.height = height * this.dpr;

    Object.assign(this.gl.canvas.style, {
      width: width + "px",
      height: height + "px"
    });
  }
  /**
   * Set gl's viewport from option's width/height and dpr parameter
   * 
   * @param {Number} width
   * @param {Number} height
   */
  setViewport(width, height) {
    if (
      this.state.viewport.width === width &&
      this.state.viewport.height === height
    )
      return;
    this.state.viewport.width = width;
    this.state.viewport.height = height;
    this.gl.viewport(0, 0, width, height);
  }
  /**
   * Enable gl's capability
   * 
   * @param {GLenum} - Class reference
   */
  enable(id) {
    if (this.state[id] === true) return;
    this.gl.enable(id);
    this.state[id] = true;
  }
  /**
   * Disable gl's capability
   * 
   * @param {GLenum} - capability's name
   */
  disable(id) {
    if (this.state[id] === false) return;
    this.gl.disable(id);
    this.state[id] = false;
  }
  /**
   * Defines which function is used for blending pixel arithmetic.
   * 
   * @param {GLenum} src - source factor
   * @param {GLenum} dst - destination factor
   * @param {GLenum} srcAlpha - source alpha value
   * @param {GLenum} dstAlpha - destination alpha value.
   */
  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
    if (
      this.state.blendFunc.src === src &&
      this.state.blendFunc.dst === dst &&
      this.state.blendFunc.srcAlpha === srcAlpha &&
      this.state.blendFunc.dstAlpha === dstAlpha
    )
      return;
    this.state.blendFunc.src = src;
    this.state.blendFunc.dst = dst;
    this.state.blendFunc.srcAlpha = srcAlpha;
    this.state.blendFunc.dstAlpha = dstAlpha;
    if (srcAlpha !== undefined)
      this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);
    else this.gl.blendFunc(src, dst);
  }
  /**
   * Set the RGB blend equation and alpha blend equation separately
   * 
   * @param {GLenum} modeRGB - A GLenum specifying how the red, green and blue components of source and destination colors are combined
   * @param {GLenum} modeAlpha - A GLenum specifying how the alpha component (transparency) of source and destination colors are combined
   */
  setBlendEquation(modeRGB, modeAlpha) {
    if (
      this.state.blendEquation.modeRGB === modeRGB &&
      this.state.blendEquation.modeAlpha === modeAlpha
    )
      return;
    this.state.blendEquation.modeRGB = modeRGB;
    this.state.blendEquation.modeAlpha = modeAlpha;
    if (modeAlpha !== undefined)
      this.gl.blendEquationSeparate(modeRGB, modeAlpha);
    else this.gl.blendEquation(modeRGB);
  }
  /**
   * Whether or not front- and/or back-facing polygons can be culled
   * 
   * @param {GLenum} value - A GLenum specifying whether front- or back-facing polygons are candidates for culling. The default value is gl.BACK
   */
  setCullFace(value) {
    if (this.state.cullFace === value) return;
    this.state.cullFace = value;
    this.gl.cullFace(value);
  }
  /**
   * Whether polygons are front- or back-facing by setting a winding orientation
   * 
   * @param {GLenum} value - A GLenum type winding orientation. The default value is gl.CCW.
   */
  setFrontFace(value) {
    if (this.state.frontFace === value) return;
    this.state.frontFace = value;
    this.gl.frontFace(value);
  }
  /**
   * Whether writing into the depth buffer is enabled or disabled
   * 
   * @param {GLboolean} value - A GLboolean specifying whether or not writing into the depth buffer is enabled. Default value: true, meaning that writing is enabled
   */
  setDepthMask(value) {
    if (this.state.depthMask === value) return;
    this.state.depthMask = value;
    this.gl.depthMask(value); //Read-only or not
  }
  /**
   * Specifies a function that compares incoming pixel depth to the current depth buffer value
   * 
   * @param {GLenum} value - A GLenum specifying the depth comparison function, which sets the conditions under which the pixel will be drawn. The default value is gl.LESS
   */
  setDepthFunc(value) {
    if (this.state.depthFunc === value) return;
    this.state.depthFunc = value;
    this.gl.depthFunc(value);
  }
  /**
   * Specifies which texture unit to make active
   * 
   * @param {Number} value - The texture unit to make active. The value is a gl.TEXTUREI where I is within the range from 0 to gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS - 1
   */
  activeTexture(value) {
    if (this.state.activeTextureUnit === value) return;
    this.state.activeTextureUnit = value;
    this.gl.activeTexture(this.gl.TEXTURE0 + value);
  }
  /**
   * Binds a given WebGLFramebuffer to a target
   * 
   * @param {Object} options - The optional framebuffer parameters
   * @param {GLenum} [options.target] - A GLenum specifying the binding point (target)
   * @param {WebGLFramebuffer} [options.buffer] - A WebGLFramebuffer object to bind
   */
  bindFramebuffer({ target = this.gl.FRAMEBUFFER, buffer = null, textures = [] } = {}) {
    if (this.state.framebuffer === buffer) return;
    this.state.framebuffer = buffer;
    this.gl.bindFramebuffer(target, buffer);
    // Todo: Multiple Render Target(WebGL 1.0/2.0)
    // let length = textures.length;
    // let drawBuffersExt = this.drawBuffersExt;
    // if(length>1){//MTR
    //   let drawBuffersArray = [];
    //   for(let i=0;i<length;i++){
    //     drawBuffersArray.push(drawBuffersExt[`COLOR_ATTACHMENT${i}_WEBGL`]);//gl_FragData[i]
    //   }
    //   drawBuffersExt.drawBuffersWEBGL(drawBuffersArray);
    // }
  }
  /**
   * Get a WebGL extension
   * 
   * @param {String} extension - A String for the name of the WebGL extension to enable.
   * @param {String} webgl2Func - A String for the name of the WebGL2 extension to enable.
   * @param {WebGLFramebuffer} extFunc - extension function of extension
   */
  getExtension(extension, webgl2Func, extFunc) {
    // if webgl2 function supported, return func bound to gl context
    if (webgl2Func && this.gl[webgl2Func])
      return this.gl[webgl2Func].bind(this.gl);

    // fetch extension once only
    if (!this.extensions[extension]) {
      this.extensions[extension] = this.gl.getExtension(extension);
    }

    // return extension if no function requested
    if (!webgl2Func) return this.extensions[extension];

    // return extension function, bound to extension
    return this.extensions[extension][extFunc].bind(this.extensions[extension]);
  }

  /**
   * Sort Opaque Object（renderOrder=>program.id=>zDepth=>id）
   *
   * @private
   */
  sortOpaque(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    } else if (a.program.id !== b.program.id) {
      return a.program.id - b.program.id;
    } else if (a.zDepth !== b.zDepth) {
      return a.zDepth - b.zDepth;
    } else {
      return b.id - a.id;
    }
  }
  /**
   * Sort transparent Object（renderOrder=>zDepth=>id）
   *
   * @private
   */
  sortTransparent(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    }
    if (a.zDepth !== b.zDepth) {
      return b.zDepth - a.zDepth;
    } else {
      return b.id - a.id;
    }
  }
  /**
  * Sort UI Object（renderOrder=>program.id=>id）
  *
  * @private
  */
  sortUI(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    } else if (a.program.id !== b.program.id) {
      return a.program.id - b.program.id;
    } else {
      return b.id - a.id;
    }
  }
  /**
    * Get the order of Render Object
    *
    * @private
    */
  getRenderList({ scene, camera, frustumCull, sort }) {
    let renderList = [];
    if (camera && frustumCull) camera.updateFrustum();
    // Get visible
    scene.traverse(node => {
      if (!node.visible) return true;
      if (!node.draw) return;
      if (frustumCull && node.frustumCulled && camera) {
        if (!camera.frustumIntersectsMesh(node)) return;
      }
      renderList.push(node);
    });
    if (sort) {
      const opaque = [];
      const transparent = []; // depthTest true
      const ui = []; // depthTest false
      renderList.forEach(node => {
        // Split into the 3 render groups
        if (!node.program.transparent) {
          opaque.push(node);
        } else if (node.program.depthTest) {
          transparent.push(node);
        } else {
          ui.push(node);
        }
        node.zDepth = 0;
        // Only calculate z-depth if renderOrder unset and depthTest is true
        if (node.renderOrder !== 0 || !node.program.depthTest || !camera)
          return;
        // update z-depth
        node.worldMatrix.getTranslation(tempVec3);
        tempVec3.applyMatrix4(camera.projectionViewMatrix);
        node.zDepth = tempVec3.z;
      });
      opaque.sort(this.sortOpaque);
      transparent.sort(this.sortTransparent);
      ui.sort(this.sortUI);
      renderList = opaque.concat(transparent, ui);
    }
    return renderList;
  }
  setRenderTarget(target) {
    // bind supplied render target and update viewport
    this.bindFramebuffer(target);
    this.setViewport(target.width, target.height);
  }
  clear(color, depth, stencil) {
    let bits = 0;
    let gl = this.gl;
    if (color === undefined || color) bits |= gl.COLOR_BUFFER_BIT;
    if (depth === undefined || depth) bits |= gl.DEPTH_BUFFER_BIT;
    if (stencil === undefined || stencil) bits |= gl.STENCIL_BUFFER_BIT;
    gl.clear(bits);
  }
  /**
   * Renders the hole scene to its webGL view
   * @param {Object} options - The optional render parameters
   * @param {Transform} [options.scene] - The scene to be rendered
   * @param {Camera} [options.camera] - The camera to be rendered
   * @param {WebGLFramebuffer} [options.target=null] - The render target
   * @param {Boolean} [options.update=true] - Whether updates all scene graph matrices
   * @param {Boolean} [options.sort=true] - Whether sort render Object（Opaque、Transparent、UI）
   * @param {Boolean} [options.frustumCull=true] - Whether enable frustumCull of camera
   */
  render({
    scene,
    camera,
    target = null,
    update = true,
    sort = true,
    frustumCull = true,
    clear = null,
  }) {
    if (target === null) {
      // make sure no render target bound so draws to canvas
      this.bindFramebuffer();
      this.setViewport(this.width * this.dpr, this.height * this.dpr);
    } else {
      // bind supplied render target and update viewport
      this.bindFramebuffer(target);
      this.setViewport(target.width, target.height);
    }
    if (clear || (this.autoClear && clear !== false)) {
      // Ensure depth buffer writing is enabled so it can be cleared
      if (this.depth) {
        this.enable(this.gl.DEPTH_TEST); //Depth Buffer
        this.setDepthMask(true);
      }
      this.clear(this.color, this.depth, this.stencil);
    }
    // updates all scene graph matrices
    if (update) scene.updateMatrixWorld();

    // Update camera separately if not in scene graph (always not in)
    if (camera && camera.parent === null) camera.updateMatrixWorld();

    // Get render list - entails culling and sorting
    const renderList = this.getRenderList({ scene, camera, frustumCull, sort });

    renderList.forEach(node => {
      node.draw({ scene, camera });
    });
  }
}
