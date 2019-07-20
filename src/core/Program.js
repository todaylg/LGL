let ID = 0;

// cache of typed arrays used to flatten uniform arrays
const arrayCacheF32 = {};

/**
 * Create Program
 * 
 * @class
 * @param {WebGLContext} gl 
 * @param {Object} [options] -  The optional program parameters
 * @param {String} [options.fragment] - VertexShader source code
 * @param {String} [options.vertex] - FragmentShader source code
 * @param {Object} [options.uniforms] - Uniforms attibute object
 * @param {Boolean} [options.transparent] - Whether is transparent
 * @param {GLenum} [options.cullFace] - Whether or not front- and/or back-facing polygons can be culled
 * @param {GLenum} [options.frontFace] - Whether polygons are front- or back-facing by setting a winding orientation
 * @param {Boolean} [options.depthTest] - Whether enable depth test
 * @param {Boolean} [options.depthWrite] -Whether enable depth write
 * @param {GLenum} [options.depthFunc] - Specifies a function that compares incoming pixel depth to the current depth buffer value.
 * @param {String} [options.blendMode] - Blend Mode (Normal/Add/Subtract/Multiply)
 */
export class Program {
    constructor(gl, {
        vertex,
        fragment,
        uniforms = {},
        transparent = false,
        cullFace = gl.BACK,
        frontFace = gl.CCW,
        depthTest = true,
        depthWrite = true,
        depthFunc = gl.LESS,
        blendMode = 'Normal',
    } = {}) {
        this.gl = gl;
        this.uniforms = uniforms;
        this.id = ID++;

        if (!vertex) console.warn('vertex shader not supplied');
        if (!fragment) console.warn('fragment shader not supplied');

        // Store program state
        this.transparent = transparent;
        this.cullFace = cullFace;
        this.frontFace = frontFace;
        this.depthTest = depthTest;
        this.depthWrite = depthWrite;
        this.depthFunc = depthFunc;
        this.blendMode = blendMode;
        this.blendFunc = {};
        this.blendEquation = {};
        
        // blend
        this.setBlendMode(blendMode);

        // compile vertex shader and log errors
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertex);
        gl.compileShader(vertexShader);
        if (gl.getShaderInfoLog(vertexShader) !== '') {
            console.warn(`${gl.getShaderInfoLog(vertexShader)}\nVertex Shader\n${addLineNumbers(vertex)}`);
        }

        // compile fragment shader and log errors
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragment);
        gl.compileShader(fragmentShader);
        if (gl.getShaderInfoLog(fragmentShader) !== '') {
            console.warn(`${gl.getShaderInfoLog(fragmentShader)}\nFragment Shader\n${addLineNumbers(fragment)}`);
        }

        // compile program and log errors
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            return console.warn(gl.getProgramInfoLog(this.program));
        }

        // Remove shader once linked
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);

        // Get active uniform locations
        this.uniformLocations = new Map();
        let numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
            let uniform = gl.getActiveUniform(this.program, uIndex);
            this.uniformLocations.set(uniform, gl.getUniformLocation(this.program, uniform.name));

            // split uniforms' names to separate array and struct declarations
            const split = uniform.name.match(/(\w+)/g);

            uniform.uniformName = split[0];

            if (split.length === 3) {
                uniform.isStructArray = true;
                uniform.structIndex = Number(split[1]);
                uniform.structProperty = split[2];
            } else if (split.length === 2 && isNaN(Number(split[1]))) {
                uniform.isStruct = true;
                uniform.structProperty = split[1];
            }
        }

        // Get active attribute locations
        this.attributeLocations = new Map();
        let locations = []; 
        let numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
        for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
            let attribute = gl.getActiveAttrib(this.program, aIndex);
            let location = gl.getAttribLocation(this.program, attribute.name);
            locations[location] = attribute.name;
            this.attributeLocations.set(attribute.name, location);
        }
        this.attributeOrder = locations.join('');
    }

    /**
     * Defines which BlendMode from input options
     * 
     * @param {String} mode - 
     */
    setBlendMode(mode) {
        if (this.gl.renderer.premultipliedAlpha){
            switch(mode){
                case 'Normal':
                        this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case 'Add':
                        this.setBlendFunc(this.gl.ONE, this.gl.ONE);
                    break;
                case 'Subtract':
                        this.setBlendFunc(this.gl.ZERO, this.gl.ZERO, this.gl.ONE_MINUS_SRC_COLOR, this.gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case 'Multiply':
                        this.setBlendFunc(this.gl.ZERO, this.gl.SRC_COLOR, this.gl.ZERO, this.gl.SRC_ALPHA);
                    break;
                default:
                    console.error('Invalid blending mode: ', mode);
                    break;
            }
        }else{
            switch(mode){
                case 'Normal':
                        this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
                    break;
                case 'Add':
                        this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
                    break;
                case 'Subtract':
                        this.setBlendFunc(this.gl.ZERO, this.gl.ONE_MINUS_SRC_COLOR);
                    break;
                case 'Multiply':
                        this.setBlendFunc(this.gl.ZERO, this.gl.SRC_COLOR);
                    break;
                default:
                    console.error('Invalid blending mode: ', mode);
                    break;
            }
        }
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
        this.blendFunc.src = src;
        this.blendFunc.dst = dst;
        this.blendFunc.srcAlpha = srcAlpha;
        this.blendFunc.dstAlpha = dstAlpha;
        if (src) this.transparent = true;
    }
    /**
     * Set the RGB blend equation and alpha blend equation separately
     * 
     * @param {GLenum} modeRGB - A GLenum specifying how the red, green and blue components of source and destination colors are combined
     * @param {GLenum} modeAlpha - A GLenum specifying how the alpha component (transparency) of source and destination colors are combined
     */
    setBlendEquation(modeRGB, modeAlpha) {
        this.blendEquation.modeRGB = modeRGB;
        this.blendEquation.modeAlpha = modeAlpha;
    }
    /**
     * Apply the options state to renderer
     */
    applyState() {
        if (this.depthTest) this.gl.renderer.enable(this.gl.DEPTH_TEST);
        else this.gl.renderer.disable(this.gl.DEPTH_TEST);

        if (this.cullFace) this.gl.renderer.enable(this.gl.CULL_FACE);
        else this.gl.renderer.disable(this.gl.CULL_FACE);

        if (this.blendFunc.src) this.gl.renderer.enable(this.gl.BLEND);
        else this.gl.renderer.disable(this.gl.BLEND);

        if (this.cullFace) this.gl.renderer.setCullFace(this.cullFace);
        this.gl.renderer.setFrontFace(this.frontFace);
        this.gl.renderer.setDepthMask(this.depthWrite);
        this.gl.renderer.setDepthFunc(this.depthFunc);
        if (this.blendFunc.src) this.gl.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
        if (this.blendEquation.modeRGB) this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
    }
    /**
     * Use the Programe according to the options setting
     * 
     * @param {Object} options - The options of Programe's use
     * @param {Boolean} [options.programActive=false] - Whether program is active
     * @param {Boolean} [options.flipFaces=false] - Whether flipFaces
     */
    use({
        flipFaces = false,
    } = {}) {
        let textureUnit = -1;
        const programActive = this.gl.renderer.currentProgram === this.id;

        // Avoid gl call if program already in use
        if (!programActive) {
            this.gl.useProgram(this.program);
            this.gl.renderer.currentProgram = this.id;
        }

        // Set only the active uniforms found in the shader
        this.uniformLocations.forEach((location, activeUniform) => {
            let name = activeUniform.uniformName;
            // Get supplied uniform
            let uniform = this.uniforms[name];

            // For structs, get the specific property instead of the entire object
            if (activeUniform.isStruct) {
                let value = uniform.value[activeUniform.structProperty];
                name += `.${activeUniform.structProperty}`;
                return setUniform(this.gl, activeUniform.type, location, value);
            }
            if (activeUniform.isStructArray) {
                let value = uniform.value[activeUniform.structIndex][activeUniform.structProperty];
                name += `[${activeUniform.structIndex}].${activeUniform.structProperty}`;
                return setUniform(this.gl, activeUniform.type, location, value);
            }

            if (!uniform) {
                return warn(`Active uniform ${name} has not been supplied`);
            }

            if (!uniform || uniform.value === undefined || uniform.value === null) {
                return warn(`${name} uniform is missing a value parameter`);
            }

            if (uniform.value.texture) {
                textureUnit = textureUnit + 1;
                // Check if texture needs to be updated
                uniform.value.update(textureUnit);
                // texture will set its own texture unit
                return setUniform(this.gl, activeUniform.type, location, textureUnit);
            }

            // For texture arrays, set uniform as an array of texture units instead of just one
            if (uniform.value.length && uniform.value[0].texture) {
                const textureUnits = [];
                uniform.value.forEach(value => {
                    textureUnit = textureUnit + 1;
                    value.update(textureUnit);
                    textureUnits.push(textureUnit);
                });
                
                return setUniform(this.gl, activeUniform.type, location, textureUnits);
            }

            setUniform(this.gl, activeUniform.type, location, uniform.value);
        });

        this.applyState();
        if (flipFaces) this.gl.renderer.setFrontFace(this.frontFace === this.gl.CCW ? this.gl.CW : this.gl.CCW);
    }
    /**
     * Delete the program and shader
     */
    remove() {
        this.gl.deleteProgram(this.program);
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
    }
}

/**
 * Set uniform value
 * 
 * @private
 * @param {WebGLContext} gl
 * @param {Number} - uniform value type
 * @param {WebGLUniformLocation} - A WebGLUniformLocation object containing the location of the uniform attribute to modify
 * @param {Number/Float32Array} A new value to be used for the uniform variable
 */
function setUniform(gl, type, location, value) {
    value = value.length ? flatten(value) : value;
    const setValue = gl.renderer.state.uniformLocations.get(location);

    // Avoid redundant uniform commands
    if (value.length) {
        if (setValue === undefined) {

            // clone array to store as cache
            gl.renderer.state.uniformLocations.set(location, value.slice(0));
        } else {
            if (arraysEqual(setValue, value)) return;

            // Update cached array values
            setValue.set(value);
            gl.renderer.state.uniformLocations.set(location, setValue);
        }
    } else {
        if (setValue === value) return;
        gl.renderer.state.uniformLocations.set(location, value);
    }

    switch (type) {
        case 5126  : return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value); // FLOAT
        case 35664 : return gl.uniform2fv(location, value); // FLOAT_VEC2
        case 35665 : return gl.uniform3fv(location, value); // FLOAT_VEC3
        case 35666 : return gl.uniform4fv(location, value); // FLOAT_VEC4
        case 35670 : // BOOL
        case 5124  : // INT
        case 35678 : // SAMPLER_2D
        case 35680 : return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value); // SAMPLER_CUBE
        case 35671 : // BOOL_VEC2
        case 35667 : return gl.uniform2iv(location, value); // INT_VEC2
        case 35672 : // BOOL_VEC3
        case 35668 : return gl.uniform3iv(location, value); // INT_VEC3
        case 35673 : // BOOL_VEC4
        case 35669 : return gl.uniform4iv(location, value); // INT_VEC4
        case 35674 : return gl.uniformMatrix2fv(location, false, value); // FLOAT_MAT2
        case 35675 : return gl.uniformMatrix3fv(location, false, value); // FLOAT_MAT3
        case 35676 : return gl.uniformMatrix4fv(location, false, value); // FLOAT_MAT4
    }
}

/**
 * Flatten uniform arrays
 * 
 * @private
 * @param {Array} array 
 * @return {Float32Array}
 */
function flatten(array) {
    const arrayLen = array.length;
    const valueLen = array[0].length;
    if (valueLen === undefined) return array;
    const length = arrayLen * valueLen;
    let value = arrayCacheF32[length];
    if (!value) arrayCacheF32[length] = value = new Float32Array(length);
    for (let i = 0; i < arrayLen; i++) value.set(array[i], i * valueLen);
    return value;
}

function addLineNumbers(string) {
    let lines = string.split('\n');
    for (let i = 0; i < lines.length; i++) {
        lines[i] = (i + 1) + ': ' + lines[i];
    }
    return lines.join('\n');
}

function arraysEqual(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0, l = a.length; i < l; i ++) {
		if (a[i] !== b[i]) return false;
	}
	return true;
}

let warnCount = 0;
function warn(message) {
    if (warnCount > 100) return;
    console.warn(message);
    warnCount++;
    if (warnCount > 100) console.warn('More than 100 program warnings - stopping logs.');
}