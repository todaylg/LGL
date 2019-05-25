var LGL = (function (exports) {
    'use strict';

    /**
     * Calculates the length of a vec3
     * @private
     * @param {vec3} a vector to calculate length of
     * @returns {Number} length of a
     */
    function length(a) {
        let x = a[0];
        let y = a[1];
        let z = a[2];
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Copy the values from one vec3 to another
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the source vector
     * @returns {vec3} out
     */
    function copy(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        return out;
    }

    /**
     * Set the components of a vec3 to the given values
     * @private
     * @param {vec3} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @returns {vec3} out
     */
    function set(out, x, y, z) {
        out[0] = x;
        out[1] = y;
        out[2] = z;
        return out;
    }

    /**
     * Adds two vec3's
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @returns {vec3} out
     */
    function add(out, a, b) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        out[2] = a[2] + b[2];
        return out;
    }

    /**
     * Subtracts vector b from vector a
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @returns {vec3} out
     */
    function subtract(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        out[2] = a[2] - b[2];
        return out;
    }

    /**
     * Multiplies two vec3's
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @returns {vec3} out
     */
    function multiply(out, a, b) {
        out[0] = a[0] * b[0];
        out[1] = a[1] * b[1];
        out[2] = a[2] * b[2];
        return out;
    }

    /**
     * Divides two vec3's
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @returns {vec3} out
     */
    function divide(out, a, b) {
        out[0] = a[0] / b[0];
        out[1] = a[1] / b[1];
        out[2] = a[2] / b[2];
        return out;
    }

    /**
     * Scales a vec3 by a scalar number
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec3} out
     */
    function scale(out, a, b) {
        out[0] = a[0] * b;
        out[1] = a[1] * b;
        out[2] = a[2] * b;
        return out;
    }

    /**
     * Calculates the euclidian distance between two vec3's
     * @private
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @returns {Number} distance between a and b
     */
    function distance(a, b) {
        let x = b[0] - a[0];
        let y = b[1] - a[1];
        let z = b[2] - a[2];
        return Math.sqrt(x * x + y * y + z * z);
    }

    /**
     * Calculates the squared euclidian distance between two vec3's
     * @private
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @returns {Number} squared distance between a and b
     */
    function squaredDistance(a, b) {
        let x = b[0] - a[0];
        let y = b[1] - a[1];
        let z = b[2] - a[2];
        return x * x + y * y + z * z;
    }

    /**
     * Calculates the squared length of a vec3
     * @private
     * @param {vec3} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    function squaredLength(a) {
        let x = a[0];
        let y = a[1];
        let z = a[2];
        return x * x + y * y + z * z;
    }

    /**
     * Negates the components of a vec3
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a vector to negate
     * @returns {vec3} out
     */
    function negate(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        out[2] = -a[2];
        return out;
    }

    /**
     * Returns the inverse of the components of a vec3
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a vector to invert
     * @returns {vec3} out
     */
    function inverse(out, a) {
        out[0] = 1.0 / a[0];
        out[1] = 1.0 / a[1];
        out[2] = 1.0 / a[2];
        return out;
    }

    /**
     * Normalize a vec3
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a vector to normalize
     * @returns {vec3} out
     */
    function normalize(out, a) {
        let x = a[0];
        let y = a[1];
        let z = a[2];
        let len = x * x + y * y + z * z;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out[0] = a[0] * len;
            out[1] = a[1] * len;
            out[2] = a[2] * len;
        }
        return out;
    }

    /**
     * Calculates the dot product of two vec3's
     * @private
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @returns {Number} dot product of a and b
     */
    function dot(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    }

    /**
     * Computes the cross product of two vec3's
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @returns {vec3} out
     */
    function cross(out, a, b) {
        let ax = a[0], ay = a[1], az = a[2];
        let bx = b[0], by = b[1], bz = b[2];

        out[0] = ay * bz - az * by;
        out[1] = az * bx - ax * bz;
        out[2] = ax * by - ay * bx;
        return out;
    }

    /**
     * Performs a linear interpolation between two vec3's
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @param {Number} t interpolation amount between the two inputs
     * @returns {vec3} out
     */
    function lerp(out, a, b, t) {
        let ax = a[0];
        let ay = a[1];
        let az = a[2];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        out[2] = az + t * (b[2] - az);
        return out;
    }

    /**
     * Performs a hermite interpolation with two control points
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @param {vec3} c the third operand
     * @param {vec3} d the fourth operand
     * @param {Number} t interpolation amount between the two inputs
     * @returns {vec3} out
     */
    function hermite(out, a, b, c, d, t) {
        let factorTimes2 = t * t;
        let factor1 = factorTimes2 * (2 * t - 3) + 1;
        let factor2 = factorTimes2 * (t - 2) + t;
        let factor3 = factorTimes2 * (t - 1);
        let factor4 = factorTimes2 * (3 - 2 * t);

        out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
        out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
        out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

        return out;
    }

    /**
     * Performs a bezier interpolation with two control points
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @param {vec3} c the third operand
     * @param {vec3} d the fourth operand
     * @param {Number} t interpolation amount between the two inputs
     * @returns {vec3} out
     */
    function bezier(out, a, b, c, d, t) {
        let inverseFactor = 1 - t;
        let inverseFactorTimesTwo = inverseFactor * inverseFactor;
        let factorTimes2 = t * t;
        let factor1 = inverseFactorTimesTwo * inverseFactor;
        let factor2 = 3 * t * inverseFactorTimesTwo;
        let factor3 = 3 * factorTimes2 * inverseFactor;
        let factor4 = factorTimes2 * t;

        out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
        out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
        out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

        return out;
    }

    /**
     * Transforms the vec3 with a mat4.
     * 4th vector component is implicitly '1'
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the vector to transform
     * @param {mat4} m matrix to transform with
     * @returns {vec3} out
     */
    function transformMat4(out, a, m) {
        let x = a[0], y = a[1], z = a[2];
        let w = m[3] * x + m[7] * y + m[11] * z + m[15];
        w = w || 1.0;
        out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
        out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
        out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
        return out;
    }

    /**
     * Transforms the vec3 with a quat
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec3} a the vector to transform
     * @param {quat} q quaternion to transform with
     * @returns {vec3} out
     */
    function transformQuat(out, a, q) {
        // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

        let x = a[0], y = a[1], z = a[2];
        let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

        // calculate quat * vec
        let ix = qw * x + qy * z - qz * y;
        let iy = qw * y + qz * x - qx * z;
        let iz = qw * z + qx * y - qy * x;
        let iw = -qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return out;
    }

    /**
     * Get the angle between two 3D vectors
     * @private
     * @param {vec3} a The first operand
     * @param {vec3} b The second operand
     * @returns {Number} The angle in radians
     */
    function angle(a, b) {
        let tempA =  [...a];
        let tempB =  [...b];

        normalize(tempA, tempA);
        normalize(tempB, tempB);

        let cosine = dot(tempA, tempB);

        if (cosine > 1.0) {
            return 0;
        }
        else if (cosine < -1.0) {
            return Math.PI;
        } else {
            return Math.acos(cosine);
        }
    }

    /**
     * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
     * @private
     * @param {vec3} a The first vector.
     * @param {vec3} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    function exactEquals(a, b) {
        return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
    }

    /** 
     * @class Vec3
     * @description Three-Dimensional Vector Class
     * @param {Number} [x=0] The element of Vec3.x
     * @param {Number} [y=x] The element of Vec3.y
     * @param {Number} [z=x] The element of Vec3.z
     * @example
     * // create a new Three-Dimensional Vector
     * new Vec3(0, 0, 0);
     */
    class Vec3 extends Array {
        constructor(x = 0, y = x, z = x) {
            super(x, y, z);
            return this;
        }

        get x() {
            return this[0];
        }

        set x(v) {
            this[0] = v;
        }

        get y() {
            return this[1];
        }

        set y(v) {
            this[1] = v;
        }

        get z() {
            return this[2];
        }

        set z(v) {
            this[2] = v;
        }
        /**
         * @function
         * @description Set the components of a vec3 to the given values
         * @param {Number} x
         * @param {Number} [y=x]
         * @param {Number} [z=x]
         * @returns {Vec3}
         */
        set(x, y = x, z = x) {
            set(this, x, y, z);
            return this;
        }
        /**
         * @function
         * @description Copy the values from one vec3 to another
         * @param {Array} v The value to copy.
         * @returns {Vec3}
         */
        copy(v) {
            copy(this, v);
            return this;
        }
        /**
         * @function
         * @description Adds two vec3's
         * @param {Array} va
         * @param {Array} [vb=this]
         * @returns {Vec3}
         */
        add(va, vb) {
            if (vb) add(this, va, vb);
            else add(this, this, va);
            return this;
        }
        /**
        * @function
        * @description Subtracts vector b from vector a
        * @param {Array} va
        * @param {Array} [vb=this]
        * @returns {Vec3}
        */
        sub(va, vb) {
            if (vb) subtract(this, va, vb);
            else subtract(this, this, va);
            return this;
        }
        /**
        * @function
        * @description Multiplies a vec3/number
        * @param {Array/Number} m
        * @returns {Vec3}
        */
        multiply(v) {
            if (v.length) multiply(this, this, v);
            else scale(this, this, v);
            return this;
        }
        /**
        * @function
        * @description Divides a vec3/number
        * @param {Array/Number} m
        * @returns {Vec3}
        */
        divide(v) {
            if (v.length) divide(this, this, v);
            else scale(this, this, 1 / v);
            return this;
        }
        /**
         * @function
         * @description Scales a vec3 by a scalar number
         * i.e.,[x × b,y × b,z × b]
         * @param {Number} b amount to scale the vector by
         * @returns {Vec3}
         */
        scale(v) {
            scale(this, this, v);
            return this;
        }
        /**
         * @function
         * @description Calculates the euclidian distance between two vec3's.
         * i.e.,length(this-v)
         * @param {vec3} [v=[0,0,0]] the operand vec3
         * @returns {Number} distance between this vec3 and v
         */
        distance(v) {
            if (v) return distance(this, v);
            else return length(this);
        }
        /**
         * @function
         * @description  Calculates the squared euclidian distance between two vec3's.
         * i.e.,length(this-v)²
         * @param {vec3} [v=[0,0,0]] the operand vec3
         * @returns {Number} squared distance between this vec3 and v
         */
        squaredDistance(v) {
            if (v) return squaredDistance(this, v);
            else return squaredLength(this);
        }
        /**
        * @function
        * @description Calculates the length of a vec3.
        * i.e.,√(x²+y²+z²)
        * @returns {Number} length of this vec3
        */
        length() {
            return this.distance();
        }
        /**
         * @function
         * @description Calculates the squared length of a vec3.
         * i.e.,x²+y²+z²
         * @returns {Number} squared length of this vec3
         */
        squaredLength() {
            return this.squaredDistance();
        }
        /**
         * @function
         * @description Negates the components of a vec3.
         * i.e.,(-x,-y,-z)
         * @param {vec3} [v=this] vector to negate
         * @returns {Vec3}
         */
        negate(v = this) {
            negate(this, v);
            return this;
        }
        /**
         * @function
         * @description Returns the inverse of the components of a vec3.
         * i.e.,(1/x,1/y,1/z)
         * @param {vec3} [v=this] vector to invert
         * @returns {Vec3}
         */
        inverse(v = this) {
            inverse(this, v);
            return this;
        }
        /**
         * @function
         * @description Normalize a vec3.
         * i.e.,v/|v| => (x/√(x²+y²+z²),y/√(x²+y²+z²),z/√(x²+y²+z²))
         * @returns {Vec3}
         */
        normalize() {
            normalize(this, this);
            return this;
        }
        /**
        * @function
        * @description Calculates the dot product of two vec3's.
        * i.e.,x × v[0]+y × v[1]+ z × v[2]
        * https://blog.csdn.net/dcrmg/article/details/52416832
        * @param {vec3} v the operand
        * @returns {Vec3}dot product of a and b
        */
        dot(v) {
            return dot(this, v);
        }
        /**
         * @function
         * @description 
         * Computes the cross product of two vec3's.
         * i.e.,[va[1] × vb[2] - va[2] × vb[1], va[2] × vb[0] - va[0] × vb[2], va[0] × vb[1] - va[1] × vb[0s\]];
         * https://blog.csdn.net/dcrmg/article/details/52416832
         * @param {vec3} va the first operand
         * @param {vec3} vb the second operand
         * @returns {Vec3}cross product of a and b
         */
        cross(va, vb) {
            cross(this, va, vb);
            return this;
        }
        /**
         * @function
         * @description Performs a linear interpolation between two vec3's
         * i.e.,[x+t×(v[0]-x),y+t×(v[1]-x),z+t×(v[2]-z)];
         * @param {vec3} v the operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {Vec3}
         */
        lerp(v, t) {
            lerp(this, this, v, t);
            return this;
        }
        /**
         * @function
         * @description Performs a hermite interpolation with two control points
         * @param {vec3} v the first operand
         * @param {vec3} b the second operand
         * @param {vec3} c the third operand
         * @param {vec3} d the fourth operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {Vec3}
         */
        hermite(v, b, c, d, t) {
            hermite(this, this, v, b, c, d, t);
            return this;
        }
        /**
         * @function
         * @description Performs a bezier interpolation with two control points
         * @param {vec3} v the first operand
         * @param {vec3} b the second operand
         * @param {vec3} c the third operand
         * @param {vec3} d the fourth operand
         * @param {Number} t interpolation amount between the two inputs
         * @returns {Vec3}
         */
        bezier(v, b, c, d, t) {
            bezier(this, this, v, b, c, d, t);
            return this;
        }
        /**
         * @function
         * @description
         * Transforms the vec3 with a mat4
         * 3rd vector component is implicitly '0'
         * 4th vector component is implicitly '1'
         * i.e.,[m[0] × x + m[4] × y + m[8] × z + m[12], m[1] × x + m[5] × y + m[9] × z + m[13],  m[2] × x + m[6] × y + m[10] × z + m[14]];
         * @param {mat4} m matrix to transform with
         * @returns {Vec3}
         */
        applyMatrix4(mat4) {
            transformMat4(this, this, mat4);
            return this;
        }
        /**
         * @function
         * @description
         * Transforms the vec3 with a quat
         * benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations
         * @param {quat} m quaternion to transform with
         * @returns {Vec3}
         */
        applyQuaternion(q) {
            transformQuat(this, this, q);
            return this;
        }
        /**
         * @function
         * @description
         * Get the angle between two 3D vectors
         * @param {vec3} m operand
         * @returns {Number} The angle in radians
         */
        angle(v) {
            return angle(this, v);
        }
        /**
         * @function
         * @description
         * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
         * @param {vec3} b The compare vector.
         * @returns {Boolean} True if the vectors are equal, false otherwise.
         */
        equals(v) {
            return exactEquals(this, v);
        }
        /**
        * @function
        * @description Deep copy from this vec3
        * @returns {Vec3}new vec3
        */
        clone() {
            return new Vec3(this[0], this[1], this[2]);
        }
        /**
         * @function
         * @description generate vec3 from Array
         * @param {Array} a
         * @param {Number} o index offset of a
         * @returns {Vec3}
         */
        fromArray(a, o = 0) {
            this[0] = a[o];
            this[1] = a[o + 1];
            this[2] = a[o + 2];
            return this;
        }
    }

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
    class Renderer {
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
        this.state.framebuffer = null;
        this.state.viewport = { width: null, height: null };
        this.state.textureUnits = [];
        this.state.textureUnitIndex = 0;
        this.state.activeTextureUnit = 0;

        // store requested extensions
        this.extensions = {};

        if (!this.isWebgl2) {
          // Initialise extra format types
          this.getExtension("OES_texture_float"); //Todo:插件介绍
          this.getExtension("OES_texture_float_linear");
          this.getExtension("OES_texture_half_float");
          this.getExtension("OES_element_index_uint");
          this.getExtension("OES_standard_derivatives");
          this.getExtension("EXT_sRGB");
          this.getExtension("WEBGL_depth_texture");
        }

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
      bindFramebuffer({ target = this.gl.FRAMEBUFFER, buffer = null } = {}) {
        if (this.state.framebuffer === buffer) return;
        this.state.framebuffer = buffer;
        this.gl.bindFramebuffer(target, buffer);
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
        frustumCull = true
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
        if (this.autoClear) {
          // Ensure depth buffer writing is enabled so it can be cleared
          if (this.depth) {
            this.enable(this.gl.DEPTH_TEST); //Depth Buffer
            this.setDepthMask(true);
          }
          this.gl.clear(
            (this.color ? this.gl.COLOR_BUFFER_BIT : 0) |
            (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) |
            (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0)
          );
        }
        // updates all scene graph matrices
        if (update) scene.updateMatrixWorld();

        // Update camera separately if not in scene graph (always not in)
        if (camera && camera.parent === null) camera.updateMatrixWorld();

        // Get render list - entails culling and sorting
        const renderList = this.getRenderList({ scene, camera, frustumCull, sort });

        renderList.forEach(node => {
          node.draw({ camera });
        });
      }
    }

    /**
     * Copies the upper-left 3x3 values into the given mat3.
     * @private
     * @param {mat3} out the receiving 3x3 matrix
     * @param {mat4} a   the source 4x4 matrix
     * @returns {mat3} out
     */
    function fromMat4(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[4];
        out[4] = a[5];
        out[5] = a[6];
        out[6] = a[8];
        out[7] = a[9];
        out[8] = a[10];
        return out;
    }

    /**
     * Copy the values from one mat3 to another
     * @private
     * @param {mat3} out the receiving matrix
     * @param {mat3} a the source matrix
     * @returns {mat3} out
     */
    function copy$1(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        return out;
    }

    /**
     * Set the components of a mat3 to the given values
     * @private
     * @param {mat3} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m10 Component in column 1, row 0 position (index 3)
     * @param {Number} m11 Component in column 1, row 1 position (index 4)
     * @param {Number} m12 Component in column 1, row 2 position (index 5)
     * @param {Number} m20 Component in column 2, row 0 position (index 6)
     * @param {Number} m21 Component in column 2, row 1 position (index 7)
     * @param {Number} m22 Component in column 2, row 2 position (index 8)
     * @returns {mat3} out
     */
    function set$1(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m10;
        out[4] = m11;
        out[5] = m12;
        out[6] = m20;
        out[7] = m21;
        out[8] = m22;
        return out;
    }

    /**
     * Set a mat3 to the identity matrix
     * @private
     * @param {mat3} out the receiving matrix
     * @returns {mat3} out
     */
    function identity(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 1;
        out[5] = 0;
        out[6] = 0;
        out[7] = 0;
        out[8] = 1;
        return out;
    }

    /**
     * Transpose the values of a mat3
     * @private
     * @param {mat3} out the receiving matrix
     * @param {mat3} a the source matrix
     * @returns {mat3} out
     */
    function transpose(out, a) {
        // If we are transposing ourselves we can skip a few steps but have to cache some values
        if (out === a) {
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a[1];
            out[5] = a[7];
            out[6] = a[2];
            out[7] = a[5];
        } else {
            out[0] = a[0];
            out[1] = a[3];
            out[2] = a[6];
            out[3] = a[1];
            out[4] = a[4];
            out[5] = a[7];
            out[6] = a[2];
            out[7] = a[5];
            out[8] = a[8];
        }
        return out;
    }

    /**
     * Inverts a mat3
     * @private
     * @param {mat3} out the receiving matrix
     * @param {mat3} a the source matrix
     * @returns {mat3} out
     */
    function invert(out, a) {
        let a00 = a[0], a01 = a[1], a02 = a[2];
        let a10 = a[3], a11 = a[4], a12 = a[5];
        let a20 = a[6], a21 = a[7], a22 = a[8];

        let b01 = a22 * a11 - a12 * a21;
        let b11 = -a22 * a10 + a12 * a20;
        let b21 = a21 * a10 - a11 * a20;

        // Calculate the determinant
        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out[0] = b01 * det;
        out[1] = (-a22 * a01 + a02 * a21) * det;
        out[2] = (a12 * a01 - a02 * a11) * det;
        out[3] = b11 * det;
        out[4] = (a22 * a00 - a02 * a20) * det;
        out[5] = (-a12 * a00 + a02 * a10) * det;
        out[6] = b21 * det;
        out[7] = (-a21 * a00 + a01 * a20) * det;
        out[8] = (a11 * a00 - a01 * a10) * det;
        return out;
    }

    /**
     * Multiplies two mat3's
     * @private
     * @param {mat3} out the receiving matrix
     * @param {mat3} a the first operand
     * @param {mat3} b the second operand
     * @returns {mat3} out
     */
    function multiply$1(out, a, b) {
        let a00 = a[0], a01 = a[1], a02 = a[2];
        let a10 = a[3], a11 = a[4], a12 = a[5];
        let a20 = a[6], a21 = a[7], a22 = a[8];

        let b00 = b[0], b01 = b[1], b02 = b[2];
        let b10 = b[3], b11 = b[4], b12 = b[5];
        let b20 = b[6], b21 = b[7], b22 = b[8];

        out[0] = b00 * a00 + b01 * a10 + b02 * a20;
        out[1] = b00 * a01 + b01 * a11 + b02 * a21;
        out[2] = b00 * a02 + b01 * a12 + b02 * a22;

        out[3] = b10 * a00 + b11 * a10 + b12 * a20;
        out[4] = b10 * a01 + b11 * a11 + b12 * a21;
        out[5] = b10 * a02 + b11 * a12 + b12 * a22;

        out[6] = b20 * a00 + b21 * a10 + b22 * a20;
        out[7] = b20 * a01 + b21 * a11 + b22 * a21;
        out[8] = b20 * a02 + b21 * a12 + b22 * a22;
        return out;
    }

    /**
     * Translate a mat3 by the given vector
     * @private
     * @param {mat3} out the receiving matrix
     * @param {mat3} a the matrix to translate
     * @param {vec2} v vector to translate by
     * @returns {mat3} out
     */
    function translate(out, a, v) {
        let a00 = a[0], a01 = a[1], a02 = a[2],
            a10 = a[3], a11 = a[4], a12 = a[5],
            a20 = a[6], a21 = a[7], a22 = a[8],
            x = v[0], y = v[1];

        out[0] = a00;
        out[1] = a01;
        out[2] = a02;

        out[3] = a10;
        out[4] = a11;
        out[5] = a12;

        out[6] = x * a00 + y * a10 + a20;
        out[7] = x * a01 + y * a11 + a21;
        out[8] = x * a02 + y * a12 + a22;
        return out;
    }

    /**
     * Rotates a mat3 by the given angle
     * @private
     * @param {mat3} out the receiving matrix
     * @param {mat3} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat3} out
     */
    function rotate(out, a, rad) {
        let a00 = a[0], a01 = a[1], a02 = a[2],
            a10 = a[3], a11 = a[4], a12 = a[5],
            a20 = a[6], a21 = a[7], a22 = a[8],

            s = Math.sin(rad),
            c = Math.cos(rad);

        out[0] = c * a00 + s * a10;
        out[1] = c * a01 + s * a11;
        out[2] = c * a02 + s * a12;

        out[3] = c * a10 - s * a00;
        out[4] = c * a11 - s * a01;
        out[5] = c * a12 - s * a02;

        out[6] = a20;
        out[7] = a21;
        out[8] = a22;
        return out;
    }
    /**
     * Scales the mat3 by the dimensions in the given vec2
     * @private
     * @param {mat3} out the receiving matrix
     * @param {mat3} a the matrix to scale
     * @param {vec2} v the vec2 to scale the matrix by
     * @returns {mat3} out
     **/
    function scale$1(out, a, v) {
        let x = v[0], y = v[1];

        out[0] = x * a[0];
        out[1] = x * a[1];
        out[2] = x * a[2];

        out[3] = y * a[3];
        out[4] = y * a[4];
        out[5] = y * a[5];

        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        return out;
    }

    /**
     * Calculates a 3x3 matrix from the given quaternion
     * @private
     * @param {mat3} out mat3 receiving operation result
     * @param {quat} q Quaternion to create matrix from
     *
     * @returns {mat3} out
     */
    function fromQuat(out, q) {
        let x = q[0], y = q[1], z = q[2], w = q[3];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let yx = y * x2;
        let yy = y * y2;
        let zx = z * x2;
        let zy = z * y2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        out[0] = 1 - yy - zz;
        out[3] = yx - wz;
        out[6] = zx + wy;

        out[1] = yx + wz;
        out[4] = 1 - xx - zz;
        out[7] = zy - wx;

        out[2] = zx - wy;
        out[5] = zy + wx;
        out[8] = 1 - xx - yy;

        return out;
    }

    /**
     * Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
     * @private
     * @param {mat3} out mat3 receiving operation result
     * @param {mat4} a Mat4 to derive the normal matrix from
     *
     * @returns {mat3} out
     */
    function normalFromMat4(out, a) {
        let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

        return out;
    }

    /**
     * Copy the values from one vec4 to another
     * @private
     * @param {vec4} out the receiving vector
     * @param {vec4} a the source vector
     * @returns {vec4} out
     */
    function copy$2(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        return out;
    }

    /**
     * Set the components of a vec4 to the given values
     * @private
     * @param {vec4} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {vec4} out
     */
    function set$2(out, x, y, z, w) {
        out[0] = x;
        out[1] = y;
        out[2] = z;
        out[3] = w;
        return out;
    }

    /**
     * Normalize a vec4
     * @private
     * @param {vec4} out the receiving vector
     * @param {vec4} a vector to normalize
     * @returns {vec4} out
     */
    function normalize$1(out, a) {
        let x = a[0];
        let y = a[1];
        let z = a[2];
        let w = a[3];
        let len = x * x + y * y + z * z + w * w;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            out[0] = x * len;
            out[1] = y * len;
            out[2] = z * len;
            out[3] = w * len;
        }
        return out;
    }

    /**
     * Calculates the dot product of two vec4's
     * @private
     * @param {vec4} a the first operand
     * @param {vec4} b the second operand
     * @returns {Number} dot product of a and b
     */
    function dot$1(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }

    /**
     * Set a quat to the identity quaternion
     * @private
     * @param {quat} out the receiving quaternion
     * @returns {quat} out
     */
    function identity$1(out) {
        out[0] = 0;
        out[1] = 0;
        out[2] = 0;
        out[3] = 1;
        return out;
    }

    /**
     * Multiplies two quats
     * @private
     * @param {quat} out the receiving quaternion
     * @param {quat} a the first operand
     * @param {quat} b the second operand
     * @returns {quat} out
     */
    function multiply$2(out, a, b) {
        let ax = a[0], ay = a[1], az = a[2], aw = a[3];
        let bx = b[0], by = b[1], bz = b[2], bw = b[3];

        out[0] = ax * bw + aw * bx + ay * bz - az * by;
        out[1] = ay * bw + aw * by + az * bx - ax * bz;
        out[2] = az * bw + aw * bz + ax * by - ay * bx;
        out[3] = aw * bw - ax * bx - ay * by - az * bz;
        return out;
    }

    /**
     * Rotates a quaternion by the given angle about the X axis
     * @private
     * @param {quat} out quat receiving operation result
     * @param {quat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {quat} out
     */
    function rotateX(out, a, rad) {
        rad *= 0.5;

        let ax = a[0], ay = a[1], az = a[2], aw = a[3];
        let bx = Math.sin(rad), bw = Math.cos(rad);

        out[0] = ax * bw + aw * bx;
        out[1] = ay * bw + az * bx;
        out[2] = az * bw - ay * bx;
        out[3] = aw * bw - ax * bx;
        return out;
    }

    /**
     * Rotates a quaternion by the given angle about the Y axis
     * @private
     * @param {quat} out quat receiving operation result
     * @param {quat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {quat} out
     */
    function rotateY(out, a, rad) {
        rad *= 0.5;

        let ax = a[0], ay = a[1], az = a[2], aw = a[3];
        let by = Math.sin(rad), bw = Math.cos(rad);

        out[0] = ax * bw - az * by;
        out[1] = ay * bw + aw * by;
        out[2] = az * bw + ax * by;
        out[3] = aw * bw - ay * by;
        return out;
    }

    /**
     * Rotates a quaternion by the given angle about the Z axis
     * @private
     * @param {quat} out quat receiving operation result
     * @param {quat} a quat to rotate
     * @param {number} rad angle (in radians) to rotate
     * @returns {quat} out
     */
    function rotateZ(out, a, rad) {
        rad *= 0.5;

        let ax = a[0], ay = a[1], az = a[2], aw = a[3];
        let bz = Math.sin(rad), bw = Math.cos(rad);

        out[0] = ax * bw + ay * bz;
        out[1] = ay * bw - ax * bz;
        out[2] = az * bw + aw * bz;
        out[3] = aw * bw - az * bz;
        return out;
    }

    /**
     * Performs a spherical linear interpolation between two quat
     * @private
     * @param {quat} out the receiving quaternion
     * @param {quat} a the first operand
     * @param {quat} b the second operand
     * @param {Number} t interpolation amount between the two inputs
     * @returns {quat} out
     */
    function slerp(out, a, b, t) {
        // benchmarks:
        //    http://jsperf.com/quaternion-slerp-implementations
        let ax = a[0], ay = a[1], az = a[2], aw = a[3];
        let bx = b[0], by = b[1], bz = b[2], bw = b[3];

        let omega, cosom, sinom, scale0, scale1;

        // calc cosine
        cosom = ax * bx + ay * by + az * bz + aw * bw;
        // adjust signs (if necessary)
        if (cosom < 0.0) {
            cosom = -cosom;
            bx = -bx;
            by = -by;
            bz = -bz;
            bw = -bw;
        }
        // calculate coefficients
        if ((1.0 - cosom) > 0.000001) {
            // standard case (slerp)
            omega = Math.acos(cosom);
            sinom = Math.sin(omega);
            scale0 = Math.sin((1.0 - t) * omega) / sinom;
            scale1 = Math.sin(t * omega) / sinom;
        } else {
            // "from" and "to" quaternions are very close
            //  ... so we can do a linear interpolation
            scale0 = 1.0 - t;
            scale1 = t;
        }
        // calculate final values
        out[0] = scale0 * ax + scale1 * bx;
        out[1] = scale0 * ay + scale1 * by;
        out[2] = scale0 * az + scale1 * bz;
        out[3] = scale0 * aw + scale1 * bw;

        return out;
    }

    /**
     * Calculates the inverse of a quat
     * @private
     * @param {quat} out the receiving quaternion
     * @param {quat} a quat to calculate inverse of
     * @returns {quat} out
     */
    function invert$1(out, a) {
        let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
        let dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
        let invDot = dot ? 1.0 / dot : 0;

        // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

        out[0] = -a0 * invDot;
        out[1] = -a1 * invDot;
        out[2] = -a2 * invDot;
        out[3] = a3 * invDot;
        return out;
    }

    /**
     * Calculates the conjugate of a quat
     * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
     * @private
     * @param {quat} out the receiving quaternion
     * @param {quat} a quat to calculate conjugate of
     * @returns {quat} out
     */
    function conjugate(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        out[2] = -a[2];
        out[3] = a[3];
        return out;
    }

    /**
     * Creates a quaternion from the given 3x3 rotation matrix.
     *
     * NOTE: The resultant quaternion is not normalized, so you should be sure
     * to renormalize the quaternion yourself where necessary.
     * @private
     * @param {quat} out the receiving quaternion
     * @param {mat3} m rotation matrix
     * @returns {quat} out
     * @function
     */
    function fromMat3(out, m) {
        // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
        // article "Quaternion Calculus and Fast Animation".
        let fTrace = m[0] + m[4] + m[8];
        let fRoot;

        if (fTrace > 0.0) {
            // |w| > 1/2, may as well choose w > 1/2
            fRoot = Math.sqrt(fTrace + 1.0);  // 2w
            out[3] = 0.5 * fRoot;
            fRoot = 0.5 / fRoot;  // 1/(4w)
            out[0] = (m[5] - m[7]) * fRoot;
            out[1] = (m[6] - m[2]) * fRoot;
            out[2] = (m[1] - m[3]) * fRoot;
        } else {
            // |w| <= 1/2
            let i = 0;
            if (m[4] > m[0])
                i = 1;
            if (m[8] > m[i * 3 + i])
                i = 2;
            let j = (i + 1) % 3;
            let k = (i + 2) % 3;

            fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
            out[i] = 0.5 * fRoot;
            fRoot = 0.5 / fRoot;
            out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
            out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
            out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
        }

        return out;
    }

    /**
     * Creates a quaternion from the given euler angle x, y, z.
     * @private
     * @param {quat} out the receiving quaternion
     * @param {vec3} euler Angles to rotate around each axis in degrees.
     * @param {String} order detailing order of operations. Default 'XYZ'.
     * @returns {quat} out
     * @function
     */
    function fromEuler(out, euler, order = 'YXZ') {
        let sx = Math.sin(euler[0] * 0.5);
        let cx = Math.cos(euler[0] * 0.5);
        let sy = Math.sin(euler[1] * 0.5);
        let cy = Math.cos(euler[1] * 0.5);
        let sz = Math.sin(euler[2] * 0.5);
        let cz = Math.cos(euler[2] * 0.5);

        if (order === 'XYZ') {
            out[0] = sx * cy * cz + cx * sy * sz;
            out[1] = cx * sy * cz - sx * cy * sz;
            out[2] = cx * cy * sz + sx * sy * cz;
            out[3] = cx * cy * cz - sx * sy * sz;
        } else if (order === 'YXZ') {
            out[0] = sx * cy * cz + cx * sy * sz;
            out[1] = cx * sy * cz - sx * cy * sz;
            out[2] = cx * cy * sz - sx * sy * cz;
            out[3] = cx * cy * cz + sx * sy * sz;
        } else if (order === 'ZXY') {
            out[0] = sx * cy * cz - cx * sy * sz;
            out[1] = cx * sy * cz + sx * cy * sz;
            out[2] = cx * cy * sz + sx * sy * cz;
            out[3] = cx * cy * cz - sx * sy * sz;
        } else if (order === 'ZYX') {
            out[0] = sx * cy * cz - cx * sy * sz;
            out[1] = cx * sy * cz + sx * cy * sz;
            out[2] = cx * cy * sz - sx * sy * cz;
            out[3] = cx * cy * cz + sx * sy * sz;
        } else if (order === 'YZX') {
            out[0] = sx * cy * cz + cx * sy * sz;
            out[1] = cx * sy * cz + sx * cy * sz;
            out[2] = cx * cy * sz - sx * sy * cz;
            out[3] = cx * cy * cz - sx * sy * sz;
        } else if (order === 'XZY') {
            out[0] = sx * cy * cz - cx * sy * sz;
            out[1] = cx * sy * cz - sx * cy * sz;
            out[2] = cx * cy * sz + sx * sy * cz;
            out[3] = cx * cy * cz + sx * sy * sz;
        }

        return out;
    }


    /**
     * Copy the values from one quat to another
     * @private
     * @param {quat} out the receiving quaternion
     * @param {quat} a the source quaternion
     * @returns {quat} out
     * @function
     */
    const copy$3 = copy$2;

    /**
     * Set the components of a quat to the given values
     * @private
     * @param {quat} out the receiving quaternion
     * @param {Number} x X component
     * @param {Number} y Y component
     * @param {Number} z Z component
     * @param {Number} w W component
     * @returns {quat} out
     * @function
     */
    const set$3 = set$2;

    /**
     * Calculates the dot product of two quat's
     * @private
     * @param {quat} a the first operand
     * @param {quat} b the second operand
     * @returns {Number} dot product of a and b
     * @function
     */
    const dot$2 = dot$1;

    /**
     * Normalize a quat
     * @private
     * @param {quat} out the receiving quaternion
     * @param {quat} a quaternion to normalize
     * @returns {quat} out
     * @function
     */
    const normalize$2 = normalize$1;

    /** 
     * @class Quat
     * @description Quaternion Class
     * @param {Number} [x=0]
     * @param {Number} [y=0]
     * @param {Number} [z=0]
     * @param {Number} [w=1]
     */
    class Quat extends Array {
        constructor(x = 0, y = 0, z = 0, w = 1) {
            super(x, y, z, w);
            this.onChange = () => {};
            return this;
        }

        get x() {
            return this[0];
        }

        set x(v) {
            this[0] = v;
            this.onChange();
        }

        get y() {
            return this[1];
        }

        set y(v) {
            this[1] = v;
            this.onChange();
        }

        get z() {
            return this[2];
        }

        set z(v) {
            this[2] = v;
            this.onChange();
        }

        get w() {
            return this[3];
        }

        set w(v) {
            this[3] = v;
            this.onChange();
        }
        /**
         * @function
         * @description Set a Quat to the identity quaternion
         * @returns {Quat} 
         */
        identity() {
            identity$1(this);
            this.onChange();
            return this;
        }
        /**
        * @function
        * @description Set the components of a quaternion to the given values.Equal to Vec4‘s set function.
        * @param {Number} x
        * @param {Number} y
        * @param {Number} z
        * @param {Number} w
        * @returns {Quat} 
        */
        set(x, y, z, w) {
            set$3(this, x, y, z, w);
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Rotates a quaternion by the given angle around the X axis
         * @param {Number} rad the angle to rotate the quaternion by
         * @param {Quat} [m=this] the quaternion to translate
         * @returns {Quat} 
         */
        rotateX(a) {
            rotateX(this, this, a);
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Rotates a quaternion by the given angle around the Y axis
         * @param {Number} rad the angle to rotate the quaternion by
         * @param {Quat} [m=this] the quaternion to translate
         * @returns {Quat} 
         */
        rotateY(a) {
            rotateY(this, this, a);
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Rotates a quaternion by the given angle around the Z axis
         * @param {Number} rad the angle to rotate the quaternion by
         * @param {Quat} [m=this] the quaternion to translate
         * @returns {Quat} 
         */
        rotateZ(a) {
            rotateZ(this, this, a);
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Calculates the inverse of a Quat
         * @param {Quat} [q=this] Quat to calculate inverse of
         * @returns {Quat} 
         */
        inverse(q = this) {
            invert$1(this, q);
            this.onChange();
            return this;
        }
        /**
        * @function
        * @description Calculates the conjugate(共轭) of a Quat
        * @param {Quat} [q=this] Quat to calculate inverse of
        * @returns {Quat} 
        */
        conjugate(q = this) {
            conjugate(this, q);
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Copy the values from one quaternion to another.Equal to Vec4‘s copy function
         * @param {Quat} q the quaternion
         * @returns {Quat} 
         */
        copy(q) {
            copy$3(this, q);
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Equal to Vec4‘s normalize function
         * @param {Quat} [q=this] the quaternion
         * @returns {Quat} 
         */
        normalize(q = this) {
            normalize$2(this, q);
            this.onChange();
            return this;
        }
        /**
        * @function
        * @description Multiplies two quats.if qB is null , Multiplies this and qA.
        * @param {Quat} qA the first operand
        * @param {Quat} qB the second operand
        * @returns {Quat} 
        */
        multiply(qA, qB) {
            if (qB) {
                multiply$2(this, qA, qB);
            } else {
                multiply$2(this, this, qA);
            }
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Equal to Vec4‘s dot function
         * @param {Quat} v
         * @returns {Quat} 
         */
        dot(v) {
            return dot$2(this, v);
        }
        /**
         * @function
         * @description Creates a quaternion from the given 3x3 rotation matrix.
         * NOTE: The resultant quaternion is not normalized, so you should be sure
         * to renormalize the quaternion yourself where necessary.
         * @param {mat3} matrix3 rotation matrix
         * @returns {Quat} 
         */
        fromMatrix3(matrix3) {
            fromMat3(this, matrix3);
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Creates a quaternion from the given euler angle x, y, z.
         * @param {vec3} euler Angles to rotate around each axis in degrees.
         * @returns {Quat} 
         */
        fromEuler(euler) {
            fromEuler(this, euler, euler.order);
            return this;
        }
        /**
         * @function
         * @description Performs a spherical linear interpolation with two control points
         *  @param {Quat} b the second operand
         * @param {Quat} c the third operand
         * @param {Quat} d the fourth operand
         * @param {Number} t interpolation amount
         * @returns {Quat} 
         */
        slerp(q, t) {
            slerp(this, this, b, c, d, t);
            return this;
        }
        /**
         * @function
         * @description generate Quat from Array
         * @param {Array} a
         * @param {Number} o index offset of a
         * @returns {Quat} 
         */
        fromArray(a, o = 0) {
            this[0] = a[o];
            this[1] = a[o + 1];
            this[2] = a[o + 2];
            this[3] = a[o + 3];
            return this;
        }
    }

    /**
     * Copy the values from one mat4 to another
     * @private
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the source matrix
     * @returns {mat4} out
     */
    function copy$4(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        out[2] = a[2];
        out[3] = a[3];
        out[4] = a[4];
        out[5] = a[5];
        out[6] = a[6];
        out[7] = a[7];
        out[8] = a[8];
        out[9] = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
    }

    /**
     * Set the components of a mat4 to the given values
     * @private
     * @param {mat4} out the receiving matrix
     * @param {Number} m00 Component in column 0, row 0 position (index 0)
     * @param {Number} m01 Component in column 0, row 1 position (index 1)
     * @param {Number} m02 Component in column 0, row 2 position (index 2)
     * @param {Number} m03 Component in column 0, row 3 position (index 3)
     * @param {Number} m10 Component in column 1, row 0 position (index 4)
     * @param {Number} m11 Component in column 1, row 1 position (index 5)
     * @param {Number} m12 Component in column 1, row 2 position (index 6)
     * @param {Number} m13 Component in column 1, row 3 position (index 7)
     * @param {Number} m20 Component in column 2, row 0 position (index 8)
     * @param {Number} m21 Component in column 2, row 1 position (index 9)
     * @param {Number} m22 Component in column 2, row 2 position (index 10)
     * @param {Number} m23 Component in column 2, row 3 position (index 11)
     * @param {Number} m30 Component in column 3, row 0 position (index 12)
     * @param {Number} m31 Component in column 3, row 1 position (index 13)
     * @param {Number} m32 Component in column 3, row 2 position (index 14)
     * @param {Number} m33 Component in column 3, row 3 position (index 15)
     * @returns {mat4} out
     */
    function set$4(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
        out[0] = m00;
        out[1] = m01;
        out[2] = m02;
        out[3] = m03;
        out[4] = m10;
        out[5] = m11;
        out[6] = m12;
        out[7] = m13;
        out[8] = m20;
        out[9] = m21;
        out[10] = m22;
        out[11] = m23;
        out[12] = m30;
        out[13] = m31;
        out[14] = m32;
        out[15] = m33;
        return out;
    }


    /**
     * Set a mat4 to the identity matrix
     * @private
     * @param {mat4} out the receiving matrix
     * @returns {mat4} out
     */
    function identity$2(out) {
        out[0] = 1;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = 1;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 1;
        out[11] = 0;
        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;
        return out;
    }

    /**
     * Inverts a mat4
     * @private
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the source matrix
     * @returns {mat4} out
     */
    function invert$2(out, a) {
        let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        if (!det) {
            return null;
        }
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

        return out;
    }

    /**
     * Calculates the determinant of a mat4
     * @private
     * @param {mat4} a the source matrix
     * @returns {Number} determinant of a
     */
    function determinant(a) {
        let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        let b00 = a00 * a11 - a01 * a10;
        let b01 = a00 * a12 - a02 * a10;
        let b02 = a00 * a13 - a03 * a10;
        let b03 = a01 * a12 - a02 * a11;
        let b04 = a01 * a13 - a03 * a11;
        let b05 = a02 * a13 - a03 * a12;
        let b06 = a20 * a31 - a21 * a30;
        let b07 = a20 * a32 - a22 * a30;
        let b08 = a20 * a33 - a23 * a30;
        let b09 = a21 * a32 - a22 * a31;
        let b10 = a21 * a33 - a23 * a31;
        let b11 = a22 * a33 - a23 * a32;

        // Calculate the determinant
        return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    }

    /**
     * Multiplies two mat4s
     * @private
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the first operand
     * @param {mat4} b the second operand
     * @returns {mat4} out
     */
    function multiply$3(out, a, b) {
        let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        // Cache only the current line of the second matrix
        let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[4];
        b1 = b[5];
        b2 = b[6];
        b3 = b[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[8];
        b1 = b[9];
        b2 = b[10];
        b3 = b[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[12];
        b1 = b[13];
        b2 = b[14];
        b3 = b[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
    }

    /**
     * Translate a mat4 by the given vector
     * @private
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to translate
     * @param {vec3} v vector to translate by
     * @returns {mat4} out
     */
    function translate$1(out, a, v) {
        let x = v[0], y = v[1], z = v[2];
        let a00, a01, a02, a03;
        let a10, a11, a12, a13;
        let a20, a21, a22, a23;

        if (a === out) {
            out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
            out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
            out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
            out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
        } else {
            a00 = a[0];
            a01 = a[1];
            a02 = a[2];
            a03 = a[3];
            a10 = a[4];
            a11 = a[5];
            a12 = a[6];
            a13 = a[7];
            a20 = a[8];
            a21 = a[9];
            a22 = a[10];
            a23 = a[11];

            out[0] = a00;
            out[1] = a01;
            out[2] = a02;
            out[3] = a03;
            out[4] = a10;
            out[5] = a11;
            out[6] = a12;
            out[7] = a13;
            out[8] = a20;
            out[9] = a21;
            out[10] = a22;
            out[11] = a23;

            out[12] = a00 * x + a10 * y + a20 * z + a[12];
            out[13] = a01 * x + a11 * y + a21 * z + a[13];
            out[14] = a02 * x + a12 * y + a22 * z + a[14];
            out[15] = a03 * x + a13 * y + a23 * z + a[15];
        }

        return out;
    }

    /**
     * Scales the mat4 by the dimensions in the given vec3 not using vectorization
     * @private
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to scale
     * @param {vec3} v the vec3 to scale the matrix by
     * @returns {mat4} out
     **/
    function scale$2(out, a, v) {
        let x = v[0], y = v[1], z = v[2];

        out[0] = a[0] * x;
        out[1] = a[1] * x;
        out[2] = a[2] * x;
        out[3] = a[3] * x;
        out[4] = a[4] * y;
        out[5] = a[5] * y;
        out[6] = a[6] * y;
        out[7] = a[7] * y;
        out[8] = a[8] * z;
        out[9] = a[9] * z;
        out[10] = a[10] * z;
        out[11] = a[11] * z;
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
        return out;
    }

    /**
     * Rotates a matrix by the given angle around the X axis
     * @private
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function rotateX$1(out, a, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a10 = a[4];
        let a11 = a[5];
        let a12 = a[6];
        let a13 = a[7];
        let a20 = a[8];
        let a21 = a[9];
        let a22 = a[10];
        let a23 = a[11];

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            out[0] = a[0];
            out[1] = a[1];
            out[2] = a[2];
            out[3] = a[3];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
        out[4] = a10 * c + a20 * s;
        out[5] = a11 * c + a21 * s;
        out[6] = a12 * c + a22 * s;
        out[7] = a13 * c + a23 * s;
        out[8] = a20 * c - a10 * s;
        out[9] = a21 * c - a11 * s;
        out[10] = a22 * c - a12 * s;
        out[11] = a23 * c - a13 * s;
        return out;
    }

    /**
     * Rotates a matrix by the given angle around the Y axis
     * @private
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function rotateY$1(out, a, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a00 = a[0];
        let a01 = a[1];
        let a02 = a[2];
        let a03 = a[3];
        let a20 = a[8];
        let a21 = a[9];
        let a22 = a[10];
        let a23 = a[11];

        if (a !== out) { // If the source and destination differ, copy the unchanged rows
            out[4] = a[4];
            out[5] = a[5];
            out[6] = a[6];
            out[7] = a[7];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
        out[0] = a00 * c - a20 * s;
        out[1] = a01 * c - a21 * s;
        out[2] = a02 * c - a22 * s;
        out[3] = a03 * c - a23 * s;
        out[8] = a00 * s + a20 * c;
        out[9] = a01 * s + a21 * c;
        out[10] = a02 * s + a22 * c;
        out[11] = a03 * s + a23 * c;
        return out;
    }

    /**
     * Rotates a matrix by the given angle around the Z axis
     * @private
     * @param {mat4} out the receiving matrix
     * @param {mat4} a the matrix to rotate
     * @param {Number} rad the angle to rotate the matrix by
     * @returns {mat4} out
     */
    function rotateZ$1(out, a, rad) {
        let s = Math.sin(rad);
        let c = Math.cos(rad);
        let a00 = a[0];
        let a01 = a[1];
        let a02 = a[2];
        let a03 = a[3];
        let a10 = a[4];
        let a11 = a[5];
        let a12 = a[6];
        let a13 = a[7];

        if (a !== out) { // If the source and destination differ, copy the unchanged last row
            out[8] = a[8];
            out[9] = a[9];
            out[10] = a[10];
            out[11] = a[11];
            out[12] = a[12];
            out[13] = a[13];
            out[14] = a[14];
            out[15] = a[15];
        }

        // Perform axis-specific matrix multiplication
        out[0] = a00 * c + a10 * s;
        out[1] = a01 * c + a11 * s;
        out[2] = a02 * c + a12 * s;
        out[3] = a03 * c + a13 * s;
        out[4] = a10 * c - a00 * s;
        out[5] = a11 * c - a01 * s;
        out[6] = a12 * c - a02 * s;
        out[7] = a13 * c - a03 * s;
        return out;
    }

    /**
     * Returns the translation vector component of a transformation
     *  matrix. If a matrix is built with fromRotationTranslation,
     *  the returned vector will be the same as the translation vector
     *  originally supplied.
     * @private
     * @param  {vec3} out Vector to receive translation component
     * @param  {mat4} mat Matrix to be decomposed (input)
     * @return {vec3} out
     */
    function getTranslation(out, mat) {
        out[0] = mat[12];
        out[1] = mat[13];
        out[2] = mat[14];

        return out;
    }

    /**
     * Returns the scaling factor component of a transformation
     *  matrix. If a matrix is built with fromRotationTranslationScale
     *  with a normalized Quaternion paramter, the returned vector will be
     *  the same as the scaling vector
     *  originally supplied.
     * @private
     * @param  {vec3} out Vector to receive scaling factor component
     * @param  {mat4} mat Matrix to be decomposed (input)
     * @return {vec3} out
     */
    function getScaling(out, mat) {
        let m11 = mat[0];
        let m12 = mat[1];
        let m13 = mat[2];
        let m21 = mat[4];
        let m22 = mat[5];
        let m23 = mat[6];
        let m31 = mat[8];
        let m32 = mat[9];
        let m33 = mat[10];

        out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
        out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
        out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

        return out;
    }
    /**
     * Returns the max scaling factor component of a transformation matrix.
     * @private
     * @param  {mat4} mat Matrix to be decomposed (input)
     * @return {Number} out
     */
    function getMaxScaleOnAxis(mat) {
        let m11 = mat[0];
        let m12 = mat[1];
        let m13 = mat[2];
        let m21 = mat[4];
        let m22 = mat[5];
        let m23 = mat[6];
        let m31 = mat[8];
        let m32 = mat[9];
        let m33 = mat[10];

        const x = m11 * m11 + m12 * m12 + m13 * m13;
        const y = m21 * m21 + m22 * m22 + m23 * m23;
        const z = m31 * m31 + m32 * m32 + m33 * m33;

        return Math.sqrt(Math.max(x, y, z));
    }

    /**
     * Returns a quaternion representing the rotational component
     *  of a transformation matrix. If a matrix is built with
     *  fromRotationTranslation, the returned quaternion will be the
     *  same as the quaternion originally supplied.
     * @private
     * @param {quat} out Quaternion to receive the rotation component
     * @param {mat4} mat Matrix to be decomposed (input)
     * @return {quat} out
     */
    function getRotation(out, mat) {
        // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
        let trace = mat[0] + mat[5] + mat[10];
        let S = 0;

        if (trace > 0) {
            S = Math.sqrt(trace + 1.0) * 2;
            out[3] = 0.25 * S;
            out[0] = (mat[6] - mat[9]) / S;
            out[1] = (mat[8] - mat[2]) / S;
            out[2] = (mat[1] - mat[4]) / S;
        } else if ((mat[0] > mat[5]) && (mat[0] > mat[10])) {
            S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
            out[3] = (mat[6] - mat[9]) / S;
            out[0] = 0.25 * S;
            out[1] = (mat[1] + mat[4]) / S;
            out[2] = (mat[8] + mat[2]) / S;
        } else if (mat[5] > mat[10]) {
            S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
            out[3] = (mat[8] - mat[2]) / S;
            out[0] = (mat[1] + mat[4]) / S;
            out[1] = 0.25 * S;
            out[2] = (mat[6] + mat[9]) / S;
        } else {
            S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
            out[3] = (mat[1] - mat[4]) / S;
            out[0] = (mat[8] + mat[2]) / S;
            out[1] = (mat[6] + mat[9]) / S;
            out[2] = 0.25 * S;
        }

        return out;
    }

    /**
     * Creates a matrix from a quaternion rotation, vector translation and vector scale
     * This is equivalent to (but much faster than):
     *
     *     mat4.identity(dest);
     *     mat4.translate(dest, vec);
     *     let quatMat = mat4.create();
     *     quat4.toMat4(quat, quatMat);
     *     mat4.multiply(dest, quatMat);
     *     mat4.scale(dest, scale)
     * @private
     * @param {mat4} out mat4 receiving operation result
     * @param {quat4} q Rotation quaternion
     * @param {vec3} v Translation vector
     * @param {vec3} s Scaling vector
     * @returns {mat4} out
     */
    function fromRotationTranslationScale(out, q, v, s) {
        // Quaternion math
        let x = q[0], y = q[1], z = q[2], w = q[3];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let xy = x * y2;
        let xz = x * z2;
        let yy = y * y2;
        let yz = y * z2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;
        let sx = s[0];
        let sy = s[1];
        let sz = s[2];

        out[0] = (1 - (yy + zz)) * sx;
        out[1] = (xy + wz) * sx;
        out[2] = (xz - wy) * sx;
        out[3] = 0;
        out[4] = (xy - wz) * sy;
        out[5] = (1 - (xx + zz)) * sy;
        out[6] = (yz + wx) * sy;
        out[7] = 0;
        out[8] = (xz + wy) * sz;
        out[9] = (yz - wx) * sz;
        out[10] = (1 - (xx + yy)) * sz;
        out[11] = 0;
        out[12] = v[0];
        out[13] = v[1];
        out[14] = v[2];
        out[15] = 1;

        return out;
    }

    /**
     * Calculates a 4x4 matrix from the given quaternion
     * @private
     * @param {mat4} out mat4 receiving operation result
     * @param {quat} q Quaternion to create matrix from
     *
     * @returns {mat4} out
     */
    function fromQuat$1(out, q) {
        let x = q[0], y = q[1], z = q[2], w = q[3];
        let x2 = x + x;
        let y2 = y + y;
        let z2 = z + z;

        let xx = x * x2;
        let yx = y * x2;
        let yy = y * y2;
        let zx = z * x2;
        let zy = z * y2;
        let zz = z * z2;
        let wx = w * x2;
        let wy = w * y2;
        let wz = w * z2;

        out[0] = 1 - yy - zz;
        out[1] = yx + wz;
        out[2] = zx - wy;
        out[3] = 0;

        out[4] = yx - wz;
        out[5] = 1 - xx - zz;
        out[6] = zy + wx;
        out[7] = 0;

        out[8] = zx + wy;
        out[9] = zy - wx;
        out[10] = 1 - xx - yy;
        out[11] = 0;

        out[12] = 0;
        out[13] = 0;
        out[14] = 0;
        out[15] = 1;

        return out;
    }

    /**
     * Generates a perspective projection matrix with the given bounds
     * @private
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} fovy Vertical field of view in radians
     * @param {number} aspect Aspect ratio. typically viewport width/height
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */
    function perspective(out, fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(fovy / 2);
        let nf = 1 / (near - far);
        out[0] = f / aspect;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = f;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = (far + near) * nf;
        out[11] = -1;
        out[12] = 0;
        out[13] = 0;
        out[14] = (2 * far * near) * nf;
        out[15] = 0;
        return out;
    }

    /**
     * Generates a orthogonal projection matrix with the given bounds
     * @private
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {number} left Left bound of the frustum
     * @param {number} right Right bound of the frustum
     * @param {number} bottom Bottom bound of the frustum
     * @param {number} top Top bound of the frustum
     * @param {number} near Near bound of the frustum
     * @param {number} far Far bound of the frustum
     * @returns {mat4} out
     */
    function ortho(out, left, right, bottom, top, near, far) {
        let lr = 1 / (left - right);
        let bt = 1 / (bottom - top);
        let nf = 1 / (near - far);
        out[0] = -2 * lr;
        out[1] = 0;
        out[2] = 0;
        out[3] = 0;
        out[4] = 0;
        out[5] = -2 * bt;
        out[6] = 0;
        out[7] = 0;
        out[8] = 0;
        out[9] = 0;
        out[10] = 2 * nf;
        out[11] = 0;
        out[12] = (left + right) * lr;
        out[13] = (top + bottom) * bt;
        out[14] = (far + near) * nf;
        out[15] = 1;
        return out;
    }

    /**
     * Generates a matrix that makes something look at something else.
     * @private
     * @param {mat4} out mat4 frustum matrix will be written into
     * @param {vec3} eye Position of the viewer
     * @param {vec3} center Point the viewer is looking at
     * @param {vec3} up vec3 pointing up
     * @returns {mat4} out
     */
    function targetTo(out, eye, target, up) {
        let eyex = eye[0],
            eyey = eye[1],
            eyez = eye[2],
            upx = up[0],
            upy = up[1],
            upz = up[2];

        let z0 = eyex - target[0],
            z1 = eyey - target[1],
            z2 = eyez - target[2];

        let len = z0 * z0 + z1 * z1 + z2 * z2;
        //Normalized z
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            z0 *= len;
            z1 *= len;
            z2 *= len;
        }
        //Cross product up and z
        let x0 = upy * z2 - upz * z1,
            x1 = upz * z0 - upx * z2,
            x2 = upx * z1 - upy * z0;

        len = x0 * x0 + x1 * x1 + x2 * x2;
        if (len > 0) {
            len = 1 / Math.sqrt(len);
            x0 *= len;
            x1 *= len;
            x2 *= len;
        }

        out[0] = x0;
        out[1] = x1;
        out[2] = x2;
        out[3] = 0;
        out[4] = z1 * x2 - z2 * x1;//Cross product x and z
        out[5] = z2 * x0 - z0 * x2;
        out[6] = z0 * x1 - z1 * x0;
        out[7] = 0;
        out[8] = z0;
        out[9] = z1;
        out[10] = z2;
        out[11] = 0;
        out[12] = eyex;
        out[13] = eyey;
        out[14] = eyez;
        out[15] = 1;
        return out;
    }

    /** 
     * @class Mat4
     * @description Four order matrix
     * @param {Number} [m00=1] The 0 row 0 column element of matrix
     * @param {Number} [m01=0] The 0 row 1 column element of matrix
     * @param {Number} [m02=0] The 0 row 2 column element of matrix
     * @param {Number} [m03=0] The 0 row 3 column element of matrix
     * @param {Number} [m10=0] The 1 row 0 column element of matrix
     * @param {Number} [m11=1] The 1 row 1 column element of matrix
     * @param {Number} [m12=0] The 1 row 2 column element of matrix
     * @param {Number} [m13=0] The 1 row 3 column element of matrix
     * @param {Number} [m20=0] The 2 row 0 column element of matrix
     * @param {Number} [m21=0] The 2 row 1 column element of matrix
     * @param {Number} [m22=1] The 2 row 2 column element of matrix
     * @param {Number} [m23=0] The 2 row 3 column element of matrix
     * @example
     * // create a new Three-Dimensional Vector
     * new Mat4();
     */
    class Mat4 extends Array {
        constructor(
            m00 = 1, m01 = 0, m02 = 0, m03 = 0, 
            m10 = 0, m11 = 1, m12 = 0, m13 = 0, 
            m20 = 0, m21 = 0, m22 = 1, m23 = 0, 
            m30 = 0, m31 = 0, m32 = 0, m33 = 1
        ) {
            super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
            return this;
        }

        set x(v) {
            this[12] = v;
        }

        get x() {
            return this[12];
        }

        set y(v) {
            this[13] = v;
        }

        get y() {
            return this[13];
        }

        set z(v) {
            this[14] = v;
        }

        get z() {
            return this[14];
        }

        set w(v) {
            this[15] = v;
        }

        get w() {
            return this[15];
        }
        /**
         * @function
         * @description Set the components of a Mat4 to the given values
         * @param {Number/Mat4} m00
         * @param {Number} m01
         * @param {Number} m02
         * @param {Number} m03
         * @param {Number} m10
         * @param {Number} m11
         * @param {Number} m22
         * @param {Number} m13
         * @param {Number} m20
         * @param {Number} m21
         * @param {Number} m22
         * @param {Number} m23
         * @param {Number} m30
         * @param {Number} m31
         * @param {Number} m32
         * @param {Number} m33
         * @returns {Mat4} 
         */
        set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
            if (m00.length) {
                return this.copy(m00);
            }
            set$4(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
            return this;
        }
        /**
        * @function
        * @description Translate a Mat4 by the given vector
        * @param {vec2} v vector to translate by
        * @param {Mat4} [m=this] the matrix to translate
        * @returns {Mat4} 
        */
        translate(v, m = this) {
            translate$1(this, m, v);
            return this;
        }
        /**
         * @function
         * @description Rotates a matrix by the given angle around the X axis
         * @param {Number} rad the angle to rotate the matrix by
         * @param {Mat4} [m=this] the matrix to translate
         * @returns {Mat4} 
         */
        rotateX(v, m = this) {
            rotateX$1(this, m, v);
            return this;
        }
        /**
         * @function
         * @description Rotates a matrix by the given angle around the Y axis
         * @param {Number} rad the angle to rotate the matrix by
         * @param {Mat4} [m=this] the matrix to translate
         * @returns {Mat4} 
         */
        rotateY(v, m = this) {
            rotateY$1(this, m, v);
            return this;
        }
        /**
         * @function
         * @description Rotates a matrix by the given angle around the Z axis
         * @param {Number} v the angle to rotate the matrix by
         * @param {Mat4} [m=this] the matrix to translate
         * @returns {Mat4} 
         */
        rotateZ(v, m = this) {
            rotateZ$1(this, m, v);
            return this;
        }
        /**
         * @function
         * @description Scales the mat4 by the dimensions in the given vec3 not using vectorization
         * @param {vec3} v the vec3 to scale the matrix by
         * @param {Mat4} [m=this] the matrix to scale
         * @returns {Mat4} 
         */
        scale(v, m = this) {
            scale$2(this, m, typeof v === "number" ? [v, v, v] : v);
            return this;
        }
        /**
         * @function
         * @description Multiplies two mat4s
         * @param {Mat4} ma the first operand
         * @param {Mat4} mb the second operand
         * @returns {Mat4} 
         */
        multiply(ma, mb) {
            if (mb) {
                multiply$3(this, ma, mb);
            } else {
                multiply$3(this, this, ma);
            }
            return this;
        }
        /**
         * @function
         * @description Set a mat4 to the identity matrix(单位矩阵)
         * @returns {Mat4} 
         */
        identity() {
            identity$2(this);
            return this;
        }
        /**
         * @function
         * @description Copy the values from one mat4 to another
         * @param {Mat4} m the source matrix
         * @returns {Mat4} 
         */
        copy(m) {
            copy$4(this, m);
            return this;
        }
        /**
         * @function
         * @description Generates a perspective projection matrix with the given bounds
         * http://www.360doc.com/content/14/1028/10/19175681_420522154.shtml
         * https://www.cnblogs.com/wuminye/p/5496950.html
         * @param {number} fovy Vertical field of view in radians
         * @param {number} aspect Aspect ratio. typically viewport width/height
         * @param {number} near Near bound of the frustum
         * @param {number} far Far bound of the frustum
         * @returns {Mat4} 
         */
        fromPerspective({ fov, aspect, near, far } = {}) {
            perspective(this, fov, aspect, near, far);
            return this;
        }
        /**
        * @function
        * @description Generates a orthogonal projection matrix with the given bounds
        * http://www.360doc.com/content/14/1028/10/19175681_420522154.shtml
        * https://www.cnblogs.com/wuminye/p/5496950.html
        *  @param {number} left Left bound of the frustum
        * @param {number} right Right bound of the frustum
        * @param {number} bottom Bottom bound of the frustum
        * @param {number} top Top bound of the frustum
        * @param {number} near Near bound of the frustum
        * @param {number} far Far bound of the frustum
        * @returns {Mat4} 
        */
        fromOrthogonal({ left, right, bottom, top, near, far }) {
            ortho(this, left, right, bottom, top, near, far);
            return this;
        }
        /**
         * @function
         * @description Calculates a 4x4 matrix from the given quaternion
         * @param {quat} q Quaternion to create matrix from
         * @returns {Mat4} 
         */
        fromQuaternion(q) {
            fromQuat$1(this, q);
            return this;
        }
        /**
         * @function
         * @description Set first three element of Mat4
         * @param {vec3} v position vec3
         * @returns {Mat4} 
         */
        setPosition(v) {
            this.x = v[0];
            this.y = v[1];
            this.z = v[2];
            return this;
        }
        /**
         * @function
         * @description Inverts a mat4
         * @returns {Mat4} 
         */
        inverse(m = this) {
            invert$2(this, m);
            return this;
        }
        /**
         * @function
         * @description Creates a matrix from a quaternion rotation, vector translation and vector scale
         * This is equivalent to (but much faster than):
         *     mat4.identity(dest);
         *     mat4.translate(dest, vec);
         *     let quatMat = mat4.create();
         *     quat4.toMat4(quat, quatMat);
         *     mat4.multiply(dest, quatMat);
         *     mat4.scale(dest, scale)
         * @param {quat4} q Rotation quaternion
         * @param {vec3} v Translation vector
         * @param {vec3} s Scaling vector
         * @returns {Mat4} 
         */
        compose(q, pos, scale) {
            fromRotationTranslationScale(this, q, pos, scale);
            return this;
        }
        /**
         * @function
         * @description Returns a quaternion representing the rotational component
         *  of a transformation matrix. If a matrix is built with
         *  fromRotationTranslation, the returned quaternion will be the
         *  same as the quaternion originally supplied.
         * @param {mat4} q Matrix to be decomposed (input)
         * @returns {Mat4} 
         */
        getRotation(q) {
            getRotation(q, this);
            return this;
        }
        /**
         * @function
         * @description Returns the translation vector component of a transformation
         *  matrix. If a matrix is built with fromRotationTranslation,
         *  the returned vector will be the same as the translation vector
         *  originally supplied.
         * @param  {mat4} mat Matrix to be decomposed (input)
         * @returns {Mat4} 
         */
        getTranslation(pos) {
            getTranslation(pos, this);
            return this;
        }
        /**
         * @function
         * @description  Returns the scaling factor component of a transformation
         *  matrix. If a matrix is built with fromRotationTranslationScale
         *  with a normalized Quaternion paramter, the returned vector will be
         *  the same as the scaling vector
         *  originally supplied.
         * @param  {mat4} mat Matrix to be decomposed (input)
         * @returns {Mat4} 
         */
        getScaling(scale) {
            getScaling(scale, this);
            return this;
        }
        /**
         * @function
         * @description  Returns the max scaling factor component of a transformation matrix. 
         * @param  {mat4} mat Matrix to be decomposed (input)
         * @returns {Number} 
         */
        getMaxScaleOnAxis() {
            return getMaxScaleOnAxis(this);
        }
        /**
        * @function
        * @description  Generates a matrix that makes something look at something else.
        * @param {vec3} eye Position of the viewer
        * @param {vec3} target Point the viewer is looking at
        * @param {vec3} up vec3 pointing up
        * @returns {Mat4} 
        */
        lookAt(eye, target, up) {
            targetTo(this, eye, target, up);
            return this;
        }
        /**
         * @function
         * @description Calculates the determinant(行列式) of a mat4
         * @returns {Mat4} 
         */
        determinant() {
            return determinant(this);
        }
        /**
        * @function
        * @description generate Mat4 from Array
        * @param {Array} a
        * @param {Number} b index offset of a
        * @returns {Mat4} 
        */
        fromArray(array, offset = 0) {
            for (var i = 0; i < 16; i++) {
                this[i] = array[i + offset];
            }
            return this;
        }
        /**
        * @function
        * @description Mat4 to Array
        * @param {Array} a
        * @param {Number} b index offset of a
        * @returns {Array} 
        */
        toArray(array = [], offset = 0) {
    		let te = this;
    		array[ offset ] = te[ 0 ];
    		array[ offset + 1 ] = te[ 1 ];
    		array[ offset + 2 ] = te[ 2 ];
    		array[ offset + 3 ] = te[ 3 ];

    		array[ offset + 4 ] = te[ 4 ];
    		array[ offset + 5 ] = te[ 5 ];
    		array[ offset + 6 ] = te[ 6 ];
    		array[ offset + 7 ] = te[ 7 ];

    		array[ offset + 8 ] = te[ 8 ];
    		array[ offset + 9 ] = te[ 9 ];
    		array[ offset + 10 ] = te[ 10 ];
    		array[ offset + 11 ] = te[ 11 ];

    		array[ offset + 12 ] = te[ 12 ];
    		array[ offset + 13 ] = te[ 13 ];
    		array[ offset + 14 ] = te[ 14 ];
            array[ offset + 15 ] = te[ 15 ];
            
    		return array;
    	}
    }

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    function fromRotationMatrix(out, m, order = 'YXZ') {
        if (order === 'XYZ') {
            out[1] = Math.asin(Math.min(Math.max(m[8], -1), 1));
            if (Math.abs(m[8]) < 0.99999) {
                out[0] = Math.atan2(-m[9], m[10]);
                out[2] = Math.atan2(-m[4], m[0]);
            } else {
                out[0] = Math.atan2(m[6], m[5]);
                out[2] = 0;
            }
        } else if (order === 'YXZ') {
            out[0] = Math.asin(-Math.min(Math.max(m[9], -1), 1));
            if (Math.abs(m[9]) < 0.99999) {
                out[1] = Math.atan2(m[8], m[10]);
                out[2] = Math.atan2(m[1], m[5]);
            } else {
                out[1] = Math.atan2(-m[2], m[0]);
                out[2] = 0;
            }
        } else if (order === 'ZXY') {
            out[0] = Math.asin(Math.min(Math.max(m[6], -1), 1));
            if (Math.abs(m[6]) < 0.99999) {
                out[1] = Math.atan2(-m[2], m[10]);
                out[2] = Math.atan2(-m[4], m[5]);
            } else {
                out[1] = 0;
                out[2] = Math.atan2(m[1], m[0]);
            }
        } else if (order === 'ZYX') {
            out[1] = Math.asin(-Math.min(Math.max(m[2], -1), 1));
            if (Math.abs(m[2]) < 0.99999) {
                out[0] = Math.atan2(m[6], m[10]);
                out[2] = Math.atan2(m[1], m[0]);
            } else {
                out[0] = 0;
                out[2] = Math.atan2(-m[4], m[5]);
            }
        } else if (order === 'YZX') {
            out[2] = Math.asin(Math.min(Math.max(m[1], -1), 1));
            if (Math.abs(m[1]) < 0.99999) {
                out[0] = Math.atan2(-m[9], m[5]);
                out[1] = Math.atan2(-m[2], m[0]);
            } else {
                out[0] = 0;
                out[1] = Math.atan2(m[8], m[10]);
            }
        } else if (order === 'XZY') {
            out[2] = Math.asin(-Math.min(Math.max(m[4], -1), 1));
            if (Math.abs(m[4]) < 0.99999) {
                out[0] = Math.atan2(m[6], m[5]);
                out[1] = Math.atan2(m[8], m[0]);
            } else {
                out[0] = Math.atan2(-m[9], m[10]);
                out[1] = 0;
            }
        }

        return out;
    }

    const tmpMat4 = new Mat4();

    /** 
     * @class Euler
     * @description Euler Class
     * @param {Array} [array=[0, 0, 0]] The element of Euler.
     * @param {Number} [x=0] The element of Euler.x
     * @param {Number} [y=x] The element of Euler.y
     * @param {Number} [z=x] The element of Euler.z
     * @param {String} [order='YXZ'] The order of Euler.
     * @example
     * // create a new Three-Dimensional Vector
     * new Euler();
     */
    class Euler extends Array {
        constructor(x = 0, y = x, z = x, order = 'YXZ') {
            super(x, y, z);
            this.order = order;
            this.onChange = () => {};
            return this;
        }

        get x() {
            return this[0];
        }

        set x(v) {
            this[0] = v;
            this.onChange();
        }

        get y() {
            return this[1];
        }

        set y(v) {
            this[1] = v;
            this.onChange();
        }

        get z() {
            return this[2];
        }

        set z(v) {
            this[2] = v;
            this.onChange();
        }
        /**
         * @function
         * @description Set the components of Euler to the given values
         * @param {Number} x
         * @param {Number} [y=x]
         * @param {Number} [z=x]
         * @returns {Euler} 
         */
        set(x, y = x, z = x) {
            this[0] = x;
            this[1] = y;
            this[2] = z;
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description Reset the order of Euler to the given values
         * @param {String} newOrder
         * @returns {Euler} 
         */
        reorder(order) {
            this.order = order;
            this.onChange();
            return this;
        }
        /**
         * @function
         * @description assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
         * @param {String} newOrder
         * @returns {Euler} 
         */
        fromRotationMatrix(m, order = this.order) {
            fromRotationMatrix(this, m, order);
            return this;
        }

        fromQuaternion(q, order = this.order) {
            tmpMat4.fromQuaternion(q);
            return this.fromRotationMatrix(tmpMat4, order);
        }
    }

    /**
     * The base class of transform object
     *
     * @class
     */
    class Transform {
        constructor() {
            this.parent = null;
            this.children = [];
            this.visible = true;

            this.matrix = new Mat4();
            this.worldMatrix = new Mat4();
            this.matrixAutoUpdate = true;

            this.position = new Vec3();
            this.quaternion = new Quat();
            this.scale = new Vec3(1, 1, 1);
            this.rotation = new Euler();
            this.up = new Vec3(0, 1, 0);

            this.rotation.onChange = () => this.quaternion.fromEuler(this.rotation);
            this.quaternion.onChange = () => this.rotation.fromQuaternion(this.quaternion);
        }

        /**
         * Set the parent Transform object
         *
         * @param {Transform} parent - The parent to add this object to
         * @param {Boolean} [notifyParent=true] Whether sync info to parent's children list
         */
        setParent(parent, notifyParent = true) {
            if (notifyParent && this.parent && parent !== this.parent) this.parent.removeChild(this, false);
            this.parent = parent;
            if (notifyParent && parent) parent.addChild(this, false);
        }
         /**
         * Transform the matrix by input
         *
         * @param {Mat4} matrix - The matrix to tranform
         */
        applyMatrix(matrix){
            this.matrix.multiply( this.matrix, this.matrix, matrix );
            // Sync change
            this.decompose();
        }
        /**
         * Add the Transform object to parent Transform object
         *
         * @param {Transform} child - The child to add
         * @param {Boolean} [notifyChild=true] Whether sync info to child's parent 
         */
        addChild(child, notifyChild = true) {
            if (!~this.children.indexOf(child)) this.children.push(child);
            if (notifyChild) child.setParent(this, false);
        }
        /**
         * Remove the Transform object from parent Transform object
         *
         * @param {Transform} child - The child to remove
         * @param {Boolean} [notifyChild=true] Whether sync info to child's parent 
         */
        removeChild(child, notifyChild = true) {
            if (!!~this.children.indexOf(child)) this.children.splice(this.children.indexOf(child), 1);
            if (notifyChild) child.setParent(null, false);
        }
        /**
         * Update the world matrix of this Transform group
         *
         * @param {Boolean} force - Whether force update matrix
         */
        updateMatrixWorld(force) {
            if (this.matrixAutoUpdate) this.updateMatrix();
            if (this.worldMatrixNeedsUpdate || force) {
                if (this.parent === null) this.worldMatrix.copy(this.matrix);
                else this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
                this.worldMatrixNeedsUpdate = false;
                force = true;
            }

            let children = this.children;
            for (let i = 0, l = children.length; i < l; i++) {
                children[i].updateMatrixWorld(force);
            }
        }
        /**
         * Update the matrix from a quaternion rotation, vector translation and vector scale
         */
        updateMatrix() {
            this.matrix.compose(this.quaternion, this.position, this.scale);
            this.worldMatrixNeedsUpdate = true;
        }
        /**
         * Traverse the callback function to all this Transfrom group
         * 
         * @param {Boolean} force - Whether force update matrix
         */
        traverse(callback) {
            callback(this);
            for (let i = 0, l = this.children.length; i < l; i++) {
                this.children[i].traverse(callback);
            }
        }
        /**
        * Decompose the matrix to a quaternion rotation, vector translation ,vector rotation, vector scale
        */
        decompose() {
            this.matrix.getTranslation(this.position);
            this.matrix.getRotation(this.quaternion);
            this.matrix.getScaling(this.scale);
            this.rotation.fromQuaternion(this.quaternion);
        }
        /**
        * Update matrix to lookAt the target
        * 
        * @param {Transfrom} target - the target to lookAt
        * @param {Boolean} invert - Whether invert lookAt target to self
        */
        lookAt(target, invert = false) {
            if (invert) this.matrix.lookAt(this.position, target, this.up);
            else this.matrix.lookAt(target, this.position, this.up);
            this.matrix.getRotation(this.quaternion);
            this.rotation.fromQuaternion(this.quaternion);
        };
    }

    const tempMat4 = new Mat4();
    const tempVec3a = new Vec3();
    const tempVec3b = new Vec3();

    /**
     * Create a camera
     * 
     * @class
     * @extends Transform
     * @param {Object} [options] -  The optional camera parameters
     * @param {Number} [options.near=0.1]
     * @param {Number} [options.far=100]
     * @param {Number} [options.fov=45]
     * @param {Number} [options.aspect=1]
     * @param {Number} [options.left]
     * @param {Number} [options.right]
     * @param {Number} [options.bottom]
     * @param {Number} [options.top]
     * 
     * @example
     * new Camera({ fov: 35 })
     */
    class Camera extends Transform {
        constructor({
            near = 0.1,
            far = 100,
            fov = 45,
            aspect = 1,
            left,
            right,
            bottom,
            top,
        } = {}) {
            super();
            this.near = near;
            this.far = far;
            this.fov = fov;
            this.aspect = aspect;

            this.projectionMatrix = new Mat4();
            this.viewMatrix = new Mat4();
            this.projectionViewMatrix = new Mat4();
            // Use orthographic if values set, else default to perspective camera
            if (left || right) this.orthographic({ left, right, bottom, top });
            else this.perspective();
        }

        /**
        * Create a perspective camera
        * 
        * @param {Object} [options] -  The optional camera parameters
        * @param {Number} [options.near=this.near] -  The perspective camera's near parameters
        * @param {Number} [options.far=this.far] - The perspective camera's far parameters
        * @param {Number} [options.fov=this.fov] - The perspective camera's fov parameters
        * @param {Number} [options.aspect=this.aspect] - The perspective camera's aspect parameters
        * @return {Camera}
        */
        perspective({
            near = this.near,
            far = this.far,
            fov = this.fov,
            aspect = this.aspect,
        } = {}) {
            this.projectionMatrix.fromPerspective({ fov: fov * (Math.PI / 180), aspect, near, far });
            this.type = 'perspective';
            return this;
        }
        /**
        * Create a orthographic camera
        * 
        * @param {Object} [options] -  The optional camera parameters
        * @param {Number} [options.near=this.near] -  The orthographic camera's near parameters
        * @param {Number} [options.far=this.far] - The orthographic camera's far parameters
        * @param {Number} [options.left=-1] - The orthographic camera's left parameters
        * @param {Number} [options.right=1] - The orthographic camera's right parameters
        * @param {Number} [options.bottom=-1] - The orthographic camera's bottom parameters
        * @param {Number} [options.top=1] - The orthographic camera's top parameters
        * @return {Camera}
        */
        orthographic({
            near = this.near,
            far = this.far,
            left = -1,
            right = 1,
            bottom = -1,
            top = 1,
        } = {}) {
            this.projectionMatrix.fromOrthogonal({ left, right, bottom, top, near, far });
            this.type = 'orthographic';
            return this;
        }
        /**
        * Update the world matrix
        */
        updateMatrixWorld() {
            super.updateMatrixWorld();
            this.viewMatrix.inverse(this.worldMatrix);//why inverse??

            // used for sorting
            this.projectionViewMatrix.multiply(this.projectionMatrix, this.viewMatrix);
            return this;
        }
        /**
        * Update matrix to lookAt the target
        */
        lookAt(target) {
            super.lookAt(target, true);
            return this;
        }
        /**
        * Project 3D coordinate to 2D point
        */
        project(v) {
            v.applyMatrix4(this.viewMatrix);
            v.applyMatrix4(this.projectionMatrix);
            return this;
        }
        /**
        *  Unproject 2D point to 3D coordinate
        */
        unproject(v) {
            v.applyMatrix4(tempMat4.inverse(this.projectionMatrix));
            v.applyMatrix4(this.worldMatrix);
            return this;
        }
        /**
        *  Update frustum of camera
        */
        updateFrustum() {
            if (!this.frustum) {
                this.frustum = [new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3(), new Vec3()];
            }
            const m = this.projectionViewMatrix;
            this.frustum[0].set(m[3] - m[0], m[7] - m[4], m[11] - m[8]).constant = m[15] - m[12]; // -x
            this.frustum[1].set(m[3] + m[0], m[7] + m[4], m[11] + m[8]).constant = m[15] + m[12]; // +x
            this.frustum[2].set(m[3] + m[1], m[7] + m[5], m[11] + m[9]).constant = m[15] + m[13]; // +y
            this.frustum[3].set(m[3] - m[1], m[7] - m[5], m[11] - m[9]).constant = m[15] - m[13]; // -y
            this.frustum[4].set(m[3] - m[2], m[7] - m[6], m[11] - m[10]).constant = m[15] - m[14]; // +z (far)
            this.frustum[5].set(m[3] + m[2], m[7] + m[6], m[11] + m[10]).constant = m[15] + m[14]; // -z (near)

            for (let i = 0; i < 6; i++) {
                const invLen = 1.0 / this.frustum[i].distance();
                this.frustum[i].multiply(invLen);
                this.frustum[i].constant *= invLen;
            }
        }
        /**
        *  Calculate the Mesh node is in frustum or not
        * 
        *  @param {Mesh} -  The Mesh node for Calculating
        */
        frustumIntersectsMesh(node) {
            if (!node.geometry.bounds || node.geometry.bounds.radius === Infinity) node.geometry.computeBoundingSphere();

            const center = tempVec3a;
            center.copy(node.geometry.bounds.center);
            center.applyMatrix4(node.worldMatrix);

            const radius = node.geometry.bounds.radius * node.worldMatrix.getMaxScaleOnAxis();

            return this.frustumIntersectsSphere(center, radius);
        }

        frustumIntersectsSphere(center, radius) {
            const normal = tempVec3b;

            for (let i = 0; i < 6; i++) {
                const plane = this.frustum[i];
                const distance = normal.copy(plane).dot(center) + plane.constant;
                if (distance < -radius) return false;
            }
            return true;
        }
    }

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
     */
    class Program {
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
            this.blendFunc = {};
            this.blendEquation = {};

            // Set default blendFunc if transparent flagged
            if (this.transparent && !this.blendFunc.src) {
                if (this.gl.renderer.premultipliedAlpha) this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
                else this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            }

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

                //Todo:????
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
            let numAttribs = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
            for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
                let attribute = gl.getActiveAttrib(this.program, aIndex);
                this.attributeLocations.set(attribute.name, gl.getAttribLocation(this.program, attribute.name));
            }

            this.checkTextureUnits();
        }

        /**
         * Check to see if any of the allocated texture units are overlapping
         */
        checkTextureUnits() {
            const assignedTextureUnits = [];
            [...this.uniformLocations.keys()].every((activeUniform) => {
                let uniform = this.uniforms[activeUniform.uniformName];

                if (activeUniform.isStruct) {
                    uniform = uniform[activeUniform.structProperty];
                }
                if (activeUniform.isStructArray) {
                    uniform = uniform[activeUniform.structIndex][activeUniform.structProperty];
                }

                if (!(uniform && uniform.value)) return true;

                // Texture array
                if (uniform.value.length && uniform.value[0].texture) {
                    for (let i = 0; i < uniform.value.length - 1; i++) {
                        if (!checkDuplicate(uniform.value[i])) return false;
                    }
                }

                if (uniform.value.texture) {
                    if (!checkDuplicate(uniform.value)) return false;
                }

                return true;
            });

            function checkDuplicate(value) {
                if (assignedTextureUnits.indexOf(value.textureUnit) > -1) {
                    // If reused, set flag to true to assign sequential units when drawn
                    this.assignTextureUnits = true;
                    return false;
                }
                assignedTextureUnits.push(value.textureUnit);
                return true;
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
            programActive = false,
            flipFaces = false,
        } = {}) {
            // Used if this.assignTextureUnits is true, when texture units overlap
            let textureUnit = -1;
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
                    uniform = uniform[activeUniform.structProperty];
                    name += `.${activeUniform.structProperty}`;
                }
                if (activeUniform.isStructArray) {
                    uniform = uniform[activeUniform.structIndex][activeUniform.structProperty];
                    name += `[${activeUniform.structIndex}].${activeUniform.structProperty}`;
                }

                if (!uniform) {
                    return warn(`Active uniform ${name} has not been supplied`);
                }

                if (uniform && uniform.value === undefined) {
                    return warn(`${name} uniform is missing a value parameter`);
                }

                if (uniform.value.texture) {
                    //Todo => Fix RenderTarget
                    if (!uniform.value.update) uniform.value = uniform.value.texture;
                    // if texture units overlapped, will sequential unit assignment
                    textureUnit = this.assignTextureUnits ? textureUnit + 1 : uniform.value.textureUnit;
                    // Check if texture needs to be updated
                    uniform.value.update(textureUnit);
                    // texture will set its own texture unit
                    return setUniform(this.gl, activeUniform.type, location, textureUnit);
                }

                // For texture arrays, set uniform as an array of texture units instead of just one
                if (uniform.value.length && uniform.value[0].texture) {
                    const textureUnits = [];
                    uniform.value.forEach(value => {
                        textureUnit = this.assignTextureUnits ? textureUnit + 1 : value.textureUnit;
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
        switch (type) {
            case 5126: return value.length ? gl.uniform1fv(location, value) : gl.uniform1f(location, value); // FLOAT
            case 35664: return gl.uniform2fv(location, value[0].length ? flatten(value) : value); // FLOAT_VEC2
            case 35665: return gl.uniform3fv(location, value[0].length ? flatten(value) : value); // FLOAT_VEC3
            case 35666: return gl.uniform4fv(location, value[0].length ? flatten(value) : value); // FLOAT_VEC4
            case 35670: // BOOL
            case 5124: // INT
            case 35678: // SAMPLER_2D
            case 35680: return value.length ? gl.uniform1iv(location, value) : gl.uniform1i(location, value); // SAMPLER_CUBE
            case 35671: // BOOL_VEC2
            case 35667: return gl.uniform2iv(location, value); // INT_VEC2
            case 35672: // BOOL_VEC3
            case 35668: return gl.uniform3iv(location, value); // INT_VEC3
            case 35673: // BOOL_VEC4
            case 35669: return gl.uniform4iv(location, value); // INT_VEC4
            case 35674: return gl.uniformMatrix2fv(location, false, value[0].length ? flatten(value) : value); // FLOAT_MAT2
            case 35675: return gl.uniformMatrix3fv(location, false, value[0].length ? flatten(value) : value); // FLOAT_MAT3
            case 35676: return gl.uniformMatrix4fv(location, false, value[0].length ? flatten(value) : value); // FLOAT_MAT4
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

    let warnCount = 0;
    function warn(message) {
        if (warnCount > 100) return;
        console.warn(message);
        warnCount++;
        if (warnCount > 100) console.warn('More than 100 program warnings - stopping logs.');
    }

    const tempVec3$1 = new Vec3();

    let ID$1 = 0;
    let ATTR_ID = 0;

    /**
     * Create a geometry
     * 
     * @class
     * @param {WebGLContext} gl 
     * @param {Object} [attribute] -  The attribute of geometry parameters
     * @param {Array} [attribute.data] - Typed array eg UInt16Array for indices, Float32Array
     * @param {Number} [attribute.size=1]
     * @param {Boolean} [attribute.instanced=false] - Boolean default false. can pass true or divisor amount
     * @param {GLenum} [attribute.type] - Default gl.UNSIGNED_SHORT for 'index', gl.FLOAT for others
     * @param {Boolean} [attribute.normalize=false] - Boolean default false
     * 
     * @example
     * new Geometry(gl, {position: { size: 3, data: new Float32Array(data.position) });
     */
    class Geometry {
        constructor(gl, attributes = {}) {
            this.gl = gl;
            this.attributes = attributes;
            this.id = ID$1++;

            this.drawRange = { start: 0, count: 0 };
            this.instancedCount = 0;

            // Unbind current VAO so that new buffers don't get added to active mesh
            this.gl.renderer.bindVertexArray(null);
            this.gl.renderer.currentGeometry = null;

            // Alias for state store to avoid redundant calls for global state
            this.glState = this.gl.renderer.state;

            // create the buffers
            for (let key in attributes) {
                this.addAttribute(key, attributes[key]);
            }
        }
        /**
        * Add attribute to geometry
        */
        addAttribute(key, attr) {
            this.attributes[key] = attr;
            // Set options
            attr.id = ATTR_ID++;
            attr.size = attr.size || 1;
            attr.type = attr.type || (
                attr.data.constructor === Float32Array ? this.gl.FLOAT :
                    attr.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT :
                        this.gl.UNSIGNED_INT); // Uint32Array
            attr.target = key === 'index' ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
            attr.normalize = attr.normalize || false;
            attr.buffer = this.gl.createBuffer();
            attr.count = attr.data.length / attr.size;
            attr.divisor = !attr.instanced ? 0 : typeof attr.instanced === 'number' ? attr.instanced : 1;
            attr.needsUpdate = false;

            // Push data to buffer
            this.updateAttribute(attr);

            // Update geometry counts. If indexed, ignore regular attributes
            if (attr.divisor) {
                this.isInstanced = true;
                if (this.instancedCount && this.instancedCount !== attr.count * attr.divisor) {
                    console.warn('geometry has multiple instanced buffers of different length');
                    return this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor);
                }
                this.instancedCount = attr.count * attr.divisor;
            } else if (key === 'index') {
                this.drawRange.count = attr.count;
            } else if (!this.attributes.index) {
                this.drawRange.count = Math.max(this.drawRange.count, attr.count);
            }
        }
        /**
        * Bind buffer and push attribute data to buffer
        */
        updateAttribute(attr) {
            // Already bound, prevent gl command
            if (this.glState.boundBuffer !== attr.id) {
                this.gl.bindBuffer(attr.target, attr.buffer);
                this.glState.boundBuffer = attr.id;
            }
            this.gl.bufferData(attr.target, attr.data, this.gl.STATIC_DRAW);
            attr.needsUpdate = false;
        }
        /**
        * Set the attribute draw range count
        * 
        * @param {Object} value - The value of index key
        */
        setIndex(value) {
            this.addAttribute('index', value);
        }
        /**
        * Set the attribute draw range start and count
        * 
        * @param {Number} start - The start value
        * @param {Number} count - The count value
        */
        setDrawRange(start, count) {
            this.drawRange.start = start;
            this.drawRange.count = count;
        }
        /**
        * Set the instance count value
        * 
        * @param {Number} value - The instance count value
        */
        setInstancedCount(value) {
            this.instancedCount = value;
        }
        /**
        * Create Vertex Array Object and bind program
        * 
        * @param {Program} program - The program to bind new vao
        */
        createVAO(program) {
            this.vao = this.gl.renderer.createVertexArray();
            this.gl.renderer.bindVertexArray(this.vao);
            this.bindAttributes(program);
        }
        /**
        * Bind attribute to program
        * 
        * @param {Program} program - The program to bind attribute
        */
        bindAttributes(program) {
            // Link all attributes to program using gl.vertexAttribPointer
            program.attributeLocations.forEach((location, name) => {
                // If geometry missing a required shader attribute
                if (!this.attributes[name]) {
                    console.warn(`active attribute ${name} not being supplied`);
                    return;
                }
                const attr = this.attributes[name];
                this.gl.bindBuffer(attr.target, attr.buffer);
                this.glState.boundBuffer = attr.id;
                this.gl.vertexAttribPointer(
                    location,
                    attr.size,
                    attr.type,
                    attr.normalize,
                    0, // stride
                    0 // offset
                );
                this.gl.enableVertexAttribArray(location);
                // For instanced attributes, divisor needs to be set.
                // For firefox, need to set back to 0 if non-instanced drawn after instanced. Else won't render
                this.gl.renderer.vertexAttribDivisor(location, attr.divisor);
            });
            // Bind indices if geometry indexed
            if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
        }
        /**
        * Draw the Geometry
        * 
        * @param {Object} [options] -  The options of drawing parameters
        * @param {GLenum} [options.mode=gl.TRIANGLES] - A GLenum specifying the type primitive to render.
        * @param {Boolean} [options.geometryBound=false] -  Calculate geometry bounding or not
        */
        draw({
            program,
            mode = this.gl.TRIANGLES,
            geometryBound = false,
        }) {
            if (!geometryBound) {
                // Create VAO on first draw. Needs to wait for program to get attribute locations
                if (!this.vao) this.createVAO(program);

                // TODO: add fallback for non vao support (ie)

                // Bind if not already bound to program
                this.gl.renderer.bindVertexArray(this.vao);

                // Store so doesn't bind redundantly
                this.gl.renderer.currentGeometry = this.id;
            }

            // Check if any attributes need updating
            program.attributeLocations.forEach((location, name) => {
                const attr = this.attributes[name];
                if (attr && attr.needsUpdate) this.updateAttribute(attr);
            });

            if (this.isInstanced) {
                if (this.attributes.index) {
                    this.gl.renderer.drawElementsInstanced(mode, this.drawRange.count, this.attributes.index.type, this.drawRange.start, this.instancedCount);
                } else {
                    this.gl.renderer.drawArraysInstanced(mode, this.drawRange.start, this.drawRange.count, this.instancedCount);
                }
            } else {
                if (this.attributes.index) {
                    this.gl.drawElements(mode, this.drawRange.count, this.attributes.index.type, this.drawRange.start);
                } else {
                    this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
                }
            }
        }
        /**
        * Calculate geometry bounding box
        * 
        * @param {Array} -  The geometry position data
        */
        computeBoundingBox(array) {
            // Use position buffer if available
            if (!array && this.attributes.position) array = this.attributes.position.data;
            if (!array) console.warn('No position buffer found to compute bounds');

            if (!this.bounds) {
                this.bounds = {
                    min: new Vec3(),
                    max: new Vec3(),
                    center: new Vec3(),
                    scale: new Vec3(),
                    radius: Infinity,
                };
            }
            const min = this.bounds.min;
            const max = this.bounds.max;
            const center = this.bounds.center;
            const scale = this.bounds.scale;

            min.set(+Infinity);
            max.set(-Infinity);

            for (let i = 0, l = array.length; i < l; i += 3) {
                const x = array[i];
                const y = array[i + 1];
                const z = array[i + 2];
                min.x = Math.min(x, min.x);
                min.y = Math.min(y, min.y);
                min.z = Math.min(z, min.z);
                max.x = Math.max(x, max.x);
                max.y = Math.max(y, max.y);
                max.z = Math.max(z, max.z);
            }
            scale.sub(max, min);
            center.add(min, max).divide(2);
        }
        /**
        * Calculate geometry bounding sphere
        * 
        * @param {Array} -  The geometry position data
        */
        computeBoundingSphere(array) {
            // Use position buffer if available
            if (!array && this.attributes.position) array = this.attributes.position.data;
            if (!array) console.warn('No position buffer found to compute bounds');

            if (!this.bounds) this.computeBoundingBox(array);

            let maxRadiusSq = 0;
            for (let i = 0, l = array.length; i < l; i += 3) {
                tempVec3$1.fromArray(array, i);
                maxRadiusSq = Math.max(maxRadiusSq, this.bounds.center.squaredDistance(tempVec3$1));
            }
            this.bounds.radius = Math.sqrt(maxRadiusSq);
        }
        /**
        * Remove geometry attributes
        */
        remove() {
            if (this.vao) this.gl.renderer.deleteVertexArray(this.vao);
            for (let key in this.attributes) {
                this.gl.deleteBuffer(this.attributes[key].buffer);
                delete this.attributes[key];
            }
        }
    }

    const emptyPixel = new Uint8Array(4);

    function isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    let ID$2 = 0;

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
    class Texture {
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
            flipY = true,
        } = {}) {
            this.gl = gl;
            this.id = ID$2++;
            // Assign texture unit spread over max available units to avoid frequent binding
            this.textureUnit = this.gl.renderer.state.textureUnitIndex++ % this.gl.renderer.parameters.maxTextureUnits;
            this.image = image;
            this.images = images;
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

            // TODO: test if premultiplyAlpha is global or per texture 
            this.state.premultiplyAlpha = false;
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
         * @param {String} [textureUnit] -  The textureUnit of update
         */
        update(textureUnit = this.textureUnit) {
            // Make sure that texture is bound to its texture unit
            if (this.glState.textureUnits[textureUnit] !== this.id) {
                this.gl.renderer.activeTexture(textureUnit);
                this.bind();
            }

            if (this.image === this.store.image && !this.needsUpdate) return;
            this.needsUpdate = false;

            // Even if bound, set active texture unit to perform texture functions
            this.gl.renderer.activeTexture(textureUnit);

            // Check if need to bind to texture unit
            this.bind();

            if (this.flipY !== this.glState.flipY) {
                this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
                this.glState.flipY = this.flipY;
            }

            if (this.premultiplyAlpha !== this.state.premultiplyAlpha) {
                this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
                this.state.premultiplyAlpha = this.premultiplyAlpha;
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

            if (this.image) {
                if (this.image.width) {
                    this.width = this.image.width;
                    this.height = this.image.height;
                }
                // CubeMap
                if (this.images && this.images.length === 6) {
                    for (let i = 0; i < this.images.length; i++) {
                        let imageEle = this.images[i];
                        this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.internalFormat, this.format, this.type, imageEle);
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

    /** 
     * @class Mat3
     * @description Three order matrix
     * @param {Array} [array=[1, 0, 0, 0, 1, 0, 0, 0, 1]] The element of matrix.
     * @param {Number} [m00=1] The 0 row 0 column element of matrix
     * @param {Number} [m01=0] The 0 row 1 column element of matrix
     * @param {Number} [m02=0] The 0 row 2 column element of matrix
     * @param {Number} [m10=0] The 1 row 0 column element of matrix
     * @param {Number} [m11=1] The 1 row 1 column element of matrix
     * @param {Number} [m12=0] The 1 row 2 column element of matrix
     * @param {Number} [m20=0] The 2 row 0 column element of matrix
     * @param {Number} [m21=0] The 2 row 1 column element of matrix
     * @param {Number} [m22=1] The 2 row 2 column element of matrix
     * @example
     * // create a new Three-Dimensional Vector
     * new Mat3();
     */
    class Mat3 extends Array {
        constructor(
            m00 = 1, m01 = 0, m02 = 0, 
            m10 = 0, m11 = 1, m12 = 0, 
            m20 = 0, m21 = 0, m22 = 1
        ) {
            super(m00, m01, m02, m10, m11, m12, m20, m21, m22);
            return this;
        }
        /**
         * @function
         * @description Set the components of a Mat3 to the given values
         * @param {Number} m00
         * @param {Number} m01
         * @param {Number} m02
         * @param {Number} m10
         * @param {Number} m11
         * @param {Number} m22
         * @param {Number} m20
         * @param {Number} m21
         * @param {Number} m22
         * @returns {Mat3}
         */
        set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
            set$1(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
            return this;
        }
        /**
         * @function
         * @description Transpose the values of a mat3
         * @returns {Mat3}
         */
        transpose() {
            transpose(this, this);
            return this;
        }
        /**
         * @function
         * @description Inverts a mat3(逆矩阵)
         * @returns {Mat3}
         */
        inverse(m = this) {
            invert(this, m);
            return this;
        }
        /**
         * @function
         * @description Translate a mat3 by the given vector
         * @param {vec2} v vector to translate by
         * @param {mat3} [m=this] the matrix to translate
         * @returns {Mat3}
         */
        translate(v, m = this) {
            translate(this, m, v);
            return this;
        }
        /**
        * @function
        * @description Rotates a mat3 by the given angle
        * @param {Number} v the angle to rotate the matrix by
        * @param {mat3} [m=this] the matrix to rotate
        * @returns {Mat3}
        */
        rotate(v, m = this) {
            rotate(this, m, v);
            return this;
        }
        /**
        * @function
        * @description Scales the mat3 by the dimensions in the given vec2
        * @param {vec2} v the vec2 to scale the matrix by
        * @param {mat3} [m=this] the matrix to scale
        * @returns {Mat3}
        */
        scale(v, m = this) {
            scale$1(this, m, v);
            return this;
        }
        /**
         * @function
         * @description Multiplies two mat3's
         * @param {mat3} ma the first operand
         * @param {mat3} mb the second operand
         * @returns {Mat3}
         */
        multiply(ma, mb) {
            if (mb) {
                multiply$1(this, ma, mb);
            } else {
                multiply$1(this, this, ma);
            }
            return this;
        }
        /**
         * @function
         * @description Set a mat3 to the identity matrix(单位矩阵)
         * @returns {Mat3}
         */
        identity() {
            identity(this);
            return this;
        }
        /**
        * @function
        * @description Copy the values from one mat3 to another
        * @param {mat3} m the source matrix
        * @returns {Mat3}
        */
        copy(m) {
            copy$1(this, m);
            return this;
        }
        /**
         * @function
         * @description Copies the upper-left 3x3 values into the given mat3.
         * @param {mat3} m the source 4x4 matrix
         * @returns {Mat3}
         */
        fromMatrix4(m) {
            fromMat4(this, m);
            return this;
        }
        /**
         * @function
         * @description Calculates a 3x3 matrix from the given quaternion
         * @param {mat3} q Quaternion to create matrix from
         * @returns {Mat3}
         */
        fromQuaternion(q) {
            fromQuat(this, q);
            return this;
        }
        /**
        * @function
        * @description Set a mat3 from the given 3 vec3
        * @param {vec3} vec3a
        * @param {vec3} vec3b
        * @param {vec3} vec3c
        * @returns {Mat3}
        */
        fromBasis(vec3a, vec3b, vec3c) {
            this.set(
                vec3a[0],
                vec3a[1],
                vec3a[2],
                vec3b[0],
                vec3b[1],
                vec3b[2],
                vec3c[0],
                vec3c[1],
                vec3c[2]
            );
            return this;
        }
        /**
        * @function
        * @description Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
        * eg:mat4 normalMatrix = transpose(inverse(modelView));
        * @param {mat4} m Mat4 to derive the normal matrix from
        * @return {Mat3}
        */
        getNormalMatrix(m) {
            normalFromMat4(this, m);
            return this;
        }
    }

    let ID$3 = 0;

    /**
     * Create Mesh
     * 
     * @class
     * @extends Transform
     * @param {WebGLContext} gl
     * @param {Object} [options] -  The optional mesh parameters
     * @param {Geometry} [options.geometry] - The geometry of mesh
     * @param {Program} [options.program] -  The program of mesh
     * @param {GLenum} [options.mode=gl.TRIANGLES] - A GLenum specifying the type primitive to render
     * @param {Boolean} [options.frustumCulled=true] - Whether enable frustum Culled
     * @param {Number} [options.renderOrder=0] - The render order
     */
    class Mesh extends Transform {
        constructor(gl, {
            geometry,
            program,
            mode = gl.TRIANGLES,
            frustumCulled = true,
            renderOrder = 0,
        } = {}) {
            super();
            this.gl = gl;
            this.id = ID$3++;

            this.geometry = geometry;
            this.program = program;
            this.mode = mode;

            // Used to skip frustum culling
            this.frustumCulled = frustumCulled;

            // Override sorting to force an order
            this.renderOrder = renderOrder;

            this.modelViewMatrix = new Mat4();
            this.normalMatrix = new Mat3();

            // Add empty matrix uniforms to program if unset
            if (!this.program.uniforms.modelMatrix) {
                Object.assign(this.program.uniforms, {
                    modelMatrix: { value: null }, //M
                    viewMatrix: { value: null }, //V => alawaysbBe replaced by camera
                    modelViewMatrix: { value: null }, //MV
                    normalMatrix: { value: null }, //N
                    projectionMatrix: { value: null }, //P => alawaysbBe replaced by camera
                    cameraPosition: { value: null },
                });
            }
        }
        /**
         * Render the Mesh
         * 
         * @param {Object} [options] -  The optional mesh parameters
         * @param {Camera} [options.camera] - The view of mesh
         */
        draw({
            camera,
        } = {}) {
            this.onBeforeRender && this.onBeforeRender({ mesh: this, camera });
            // Set the matrix uniforms
            if (camera) {
                //replaced by camera matrix
                this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
                this.program.uniforms.cameraPosition.value = camera.position;
                this.program.uniforms.viewMatrix.value = camera.viewMatrix;

                this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
                this.normalMatrix.getNormalMatrix(this.modelViewMatrix);

                //replaced by mesh matrix
                this.program.uniforms.modelMatrix.value = this.matrix;
                this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
                this.program.uniforms.normalMatrix.value = this.normalMatrix;
            }

            // determine if faces need to be flipped - when mesh scaled negatively
            let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;

            // Check here if any bindings can be skipped. Geometry also needs to be rebound if different program
            const programActive = this.gl.renderer.currentProgram === this.program.id;
            const geometryBound = programActive && this.gl.renderer.currentGeometry === this.geometry.id;

            this.program.use({ programActive, flipFaces });
            this.geometry.draw({ mode: this.mode, program: this.program, geometryBound });

            this.onAfterRender && this.onAfterRender({ mesh: this, camera });
        }
    }

    // TODO: multi target rendering

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
     */
    class RenderTarget {
        constructor(gl, {
            width = gl.canvas.width,
            height = gl.canvas.height,
            target = gl.FRAMEBUFFER,
            color = 1, // number of color attachments
            depth = true,
            stencil = false,
            depthTexture = false, // note - stencil breaks
            wrapS = gl.CLAMP_TO_EDGE,
            wrapT = gl.CLAMP_TO_EDGE,
            minFilter = gl.LINEAR,
            magFilter = gl.LINEAR,
        } = {}) {
            this.gl = gl;
            this.width = width;
            this.height = height;
            this.buffer = this.gl.createFramebuffer();
            this.target = target;
            this.gl.bindFramebuffer(this.target, this.buffer);
            this.textures = [];
            // TODO: multi target rendering
            // create and attach required num of color textures
            for (let i = 0; i < color; i++) {
                this.textures.push(new Texture(gl, {
                    width, height, wrapS, wrapT, minFilter, magFilter,
                    flipY: false,
                    generateMipmaps: false,
                }));
                this.textures[i].update();
                // color, alpha
                this.gl.framebufferTexture2D(this.target, this.gl.COLOR_ATTACHMENT0 + i, this.gl.TEXTURE_2D, this.textures[i].texture, 0 /* level */);
            }

            // alias for majority of use cases
            this.texture = this.textures[0];

            // depth and stencil
            // note depth textures break stencil - so can't use together
            if (depthTexture && (this.gl.renderer.isWebgl2 || this.gl.renderer.getExtension('WEBGL_depth_texture'))) {
                this.depthTexture = new Texture(gl, {
                    width, height, wrapS, wrapT,
                    minFilter: this.gl.NEAREST,
                    magFilter: this.gl.NEAREST,
                    flipY: false,
                    format: this.gl.DEPTH_COMPONENT,
                    internalFormat: gl.renderer.isWebgl2 ? this.gl.DEPTH_COMPONENT24 : this.gl.DEPTH_COMPONENT,
                    type: this.gl.UNSIGNED_INT,
                    generateMipmaps: false,
                });
                this.depthTexture.update();
                this.gl.framebufferTexture2D(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_2D, this.depthTexture.texture, 0 /* level */);
            } else {
                // Render buffers (attaches a WebGLRenderbuffer object to a WebGLFramebuffer object)
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
            this.gl.bindFramebuffer(this.target, null);
        }
        clone() {
            // deep clone
            return new RenderTarget(this.gl, this);
        }
    }

    /**
     * Copy the values from one vec2 to another
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the source vector
     * @returns {vec2} out
     */
    function copy$5(out, a) {
        out[0] = a[0];
        out[1] = a[1];
        return out;
    }

    /**
     * Set the components of a vec2 to the given values
     * @private
     * @param {vec2} out the receiving vector
     * @param {Number} x X component
     * @param {Number} y Y component
     * @returns {vec2} out
     */
    function set$5(out, x, y) {
        out[0] = x;
        out[1] = y;
        return out;
    }

    /**
     * Adds two vec2's
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {vec2} out
     */
    function add$1(out, a, b) {
        out[0] = a[0] + b[0];
        out[1] = a[1] + b[1];
        return out;
    }

    /**
     * Subtracts vector b from vector a
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {vec2} out
     */
    function subtract$1(out, a, b) {
        out[0] = a[0] - b[0];
        out[1] = a[1] - b[1];
        return out;
    }

    /**
     * Multiplies two vec2's
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {vec2} out
     */
    function multiply$4(out, a, b) {
        out[0] = a[0] * b[0];
        out[1] = a[1] * b[1];
        return out;
    }
    /**
     * Divides two vec2's
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {vec2} out
     */
    function divide$1(out, a, b) {
        out[0] = a[0] / b[0];
        out[1] = a[1] / b[1];
        return out;
    }
    /**
     * Scales a vec2 by a scalar number
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the vector to scale
     * @param {Number} b amount to scale the vector by
     * @returns {vec2} out
     */
    function scale$3(out, a, b) {
        out[0] = a[0] * b;
        out[1] = a[1] * b;
        return out;
    }
    /**
     * Calculates the euclidian distance between two vec2's
     * @private
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {Number} distance between a and b
     */
    function distance$1(a, b) {
        var x = b[0] - a[0],
            y = b[1] - a[1];
        return Math.sqrt(x * x + y * y);
    }
    /**
     * Calculates the squared euclidian distance between two vec2's
     * @private
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {Number} squared distance between a and b
     */
    function squaredDistance$1(a, b) {
        var x = b[0] - a[0],
            y = b[1] - a[1];
        return x * x + y * y;
    }
    /**
     * Calculates the length of a vec2
     * @private
     * @param {vec2} a vector to calculate length of
     * @returns {Number} length of a
     */
    function length$1(a) {
        var x = a[0],
            y = a[1];
        return Math.sqrt(x * x + y * y);
    }
    /**
     * Calculates the squared length of a vec2
     * @private
     * @param {vec2} a vector to calculate squared length of
     * @returns {Number} squared length of a
     */
    function squaredLength$1(a) {
        var x = a[0],
            y = a[1];
        return x * x + y * y;
    }
    /**
     * Negates the components of a vec2
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a vector to negate
     * @returns {vec2} out
     */
    function negate$1(out, a) {
        out[0] = -a[0];
        out[1] = -a[1];
        return out;
    }
    /**
     * Returns the inverse of the components of a vec2
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a vector to invert
     * @returns {vec2} out
     */
    function inverse$1(out, a) {
        out[0] = 1.0 / a[0];
        out[1] = 1.0 / a[1];
        return out;
    }
    /**
     * Normalize a vec2
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a vector to normalize
     * @returns {vec2} out
     */
    function normalize$3(out, a) {
        var x = a[0],
            y = a[1];
        var len = x * x + y * y;
        if (len > 0) {
            //TODO: evaluate use of glm_invsqrt here?
            len = 1 / Math.sqrt(len);
            out[0] = a[0] * len;
            out[1] = a[1] * len;
        }
        return out;
    }
    /**
     * Calculates the dot product of two vec2's
     * @private
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {Number} dot product of a and b
     */
    function dot$3(a, b) {
        return a[0] * b[0] + a[1] * b[1];
    }
    /**
     * Computes the cross product of two vec2's
     * Note that the cross product returns a scalar of z
     * @private
     * @param {vec3} out the receiving vector
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @returns {Number} cross product of a and b
     */
    function cross$1(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }
    /**
     * Performs a linear interpolation between two vec2's
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the first operand
     * @param {vec2} b the second operand
     * @param {Number} t interpolation amount between the two inputs
     * @returns {vec2} out
     */
    function lerp$1(out, a, b, t) {
        var ax = a[0],
            ay = a[1];
        out[0] = ax + t * (b[0] - ax);
        out[1] = ay + t * (b[1] - ay);
        return out;
    }
    /**
     * Transforms the vec2 with a mat3
     * 3rd vector component is implicitly '1'
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the vector to transform
     * @param {mat3} m matrix to transform with
     * @returns {vec2} out
     */
    function transformMat3(out, a, m) {
        var x = a[0],
            y = a[1];
        out[0] = m[0] * x + m[3] * y + m[6];
        out[1] = m[1] * x + m[4] * y + m[7];
        return out;
    }
    /**
     * Transforms the vec2 with a mat4
     * 3rd vector component is implicitly '0'
     * 4th vector component is implicitly '1'
     * @private
     * @param {vec2} out the receiving vector
     * @param {vec2} a the vector to transform
     * @param {mat4} m matrix to transform with
     * @returns {vec2} out
     */
    function transformMat4$1(out, a, m) {
        let x = a[0];
        let y = a[1];
        out[0] = m[0] * x + m[4] * y + m[12];
        out[1] = m[1] * x + m[5] * y + m[13];
        return out;
    }

    /**
     * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
     * @private
     * @param {vec2} a The first vector.
     * @param {vec2} b The second vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    function exactEquals$1(a, b) {
        return a[0] === b[0] && a[1] === b[1];
    }

    /** 
     * @class Vec2
     * @description Two-Dimensional Vector Class
     * @param {Number} [x=0] The element of Vec2.x
     * @param {Number} [y=x] The element of Vec2.y
     * @example
     * // create a new Two-Dimensional Vector
     * new Vec2(0, 0);
     */
    class Vec2 extends Array {
        constructor(x = 0, y = x) {
            super(x, y);
            return this;
        }

        get x() {
            return this[0];
        }

        set x(v) {
            this[0] = v;
        }

        get y() {
            return this[1];
        }

        set y(v) {
            this[1] = v;
        }
        /**
         * @function
         * @description Set the components of a vec2 to the given values
         * @param {Number} x
         * @param {Number} [y=x]
         * @returns {Vec2} 
         */
        set(x, y = x) {
            set$5(this, x, y);
            return this;
        }
        /**
         * @function
         * @description Copy the values from one vec2 to another
         * @param {Array} v The value to copy.
         * @returns {Vec2} 
         */
        copy(v) {
            copy$5(this, v);
            return this;
        }
        /**
         * @function
         * @description Adds two vec2's
         * @param {Array} va
         * @param {Array} [vb=this]
         * @returns {Vec2} 
         */
        add(va, vb) {
            if (vb) add$1(this, va, vb);
            else add$1(this, this, va);
            return this;
        }
        /**
        * @function
        * @description Subtracts vector b from vector a
        * @param {Array} va
        * @param {Array} [vb=this]
        * @returns {Vec2} 
        */
        sub(va, vb) {
            if (vb) subtract$1(this, va, vb);
            else subtract$1(this, this, va);
            return this;
        }
        /**
        * @function
        * @description Multiplies a vec2/number
        * @param {Array/Number} m
        * @returns {Vec2} 
        */
        multiply(m) {
            if (m.length) multiply$4(this, this, m);
            else scale$3(this, this, m);
            return this;
        }
        /**
        * @function
        * @description Divides a vec2/number
        * @param {Array/Number} m
        * @returns {Vec2} 
        */
        divide(m) {
            if (m.length) divide$1(this, this, m);
            else scale$3(this, this, 1 / m);
            return this;
        }
        /**
         * @function
         * @description Scales a vec2 by a scalar number
         * i.e.,[x × b,y × b]
         * @param {Number} b amount to scale the vector by
         * @returns {Vec2} 
         */
        scale(v) {
            scale$3(this, this, v);
            return this;
        }
        /**
         * @function
         * @description Calculates the euclidian distance between two vec2's.
         * i.e.,length(this-v)
         * @param {Vec2} [v=[0,0]] the operand vec2
         * @returns {Number} distance between this vec2 and v
         */
        distance(v) {
            if (v) return distance$1(this, v);
            else return length$1(this);
        }
        /**
         * @function
         * @description  Calculates the squared euclidian distance between two vec2's.
         * i.e.,length(this-v)²
         * @param {Vec2} [v=[0,0]] the operand vec2
         * @returns {Number} squared distance between this vec2 and v
         */
        squaredDistance(v) {
            if (v) return squaredDistance$1(this, v);
            else return squaredLength$1(this);
        }
        /**
         * @function
         * @description Calculates the length of a vec2.
         * i.e.,√(x²+y²)
         * @returns {Number} length of this vec2
         */
        len() {
            return length$1(this);
        }
        /**
         * @function
         * @description Calculates the squared length of a vec2.
         * i.e.,x²+y²
         * @returns {Number} squared length of this vec2
         */
        squaredLength() {
            return this.squaredDistance();
        }
        /**
         * @function
         * @description Negates the components of a vec2.
         * i.e.,(-x,-y)
         * @param {Vec2} [v=this] vector to negate
         * @returns {Vec2} 
         */
        negate(v = this) {
            negate$1(this, v);
            return this;
        }
        /**
         * @function
         * @description Returns the inverse of the components of a vec2.
         * i.e.,(1/x,1/y)
         * @param {vec2} [v=this] vector to invert
         * @returns {Vec2} 
         */
        inverse(v = this) {
            inverse$1(this, v);
            return this;
        }
        /**
         * @function
         * @description Normalize a vec2.
         * i.e.,v/|v| => (x/√(x²+y²),y/√(x²+y²))
         * @returns {Vec2} 
         */
        normalize() {
            normalize$3(this, this);
        }
        /**
        * @function
        * @description Calculates the dot product of two vec2's.
        * i.e.,x × v[0]+y × v[1]
        * https://blog.csdn.net/dcrmg/article/details/52416832 
        * @param {Vec2} v the operand
        * @returns {Vec2} dot product of a and b
        */
        dot(v) {
            return dot$3(this, v);
        }
        /**
         * @function
         * @description 
         * Computes the cross product of two vec2's.
         * Note that the cross product returns a scalar of z.
         * i.e.,va[0] × vb[1] - va[1] × vb[0];
         * https://blog.csdn.net/dcrmg/article/details/52416832
         * @param {Vec2} va the first operand
         * @param {Vec2} vb the second operand
         * @returns {Number} 
         */
        cross(va, vb) {
            return cross$1(va, vb);
        }
        /**
         * @function
         * @description Performs a linear interpolation between two vec2's
         * i.e.,[x+a×(v[0]-x),y+a×(v[1]-x)];
         * @param {Vec2} v the operand
         * @param {Number} a interpolation amount between the two inputs
         * @returns {Vec2} 
         */
        lerp(v, a) {
            lerp$1(this, this, v, a);
        }
        /**
         * @function
         * @description Transforms the vec2 with a mat3
         * 3rd vector component is implicitly '1'
         * i.e.,[m[0] × x + m[3] * y + m[6], m[1] × x + m[4] × y + m[7]];
         * @param {mat3} m matrix to transform with
         * @returns {Vec2} 
         */
        applyMatrix3(mat3) {
            transformMat3(this, this, mat3);
            return this;
        }
        /**
         * @function
         * @description
         * Transforms the vec2 with a mat4
         * 3rd vector component is implicitly '0'
         * 4th vector component is implicitly '1'
         * i.e.,[m[0] × x + m[4] × y + m[12], m[1] × x + m[5] × y + m[13]];
         * @param {mat4} m matrix to transform with
         * @returns {Vec2} 
         */
        applyMatrix4(mat4) {
            transformMat4$1(this, this, mat4);
            return this;
        }
        /**
         * @function
         * @description
         * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
         * @param {vec2} b The compare vector.
         * @returns {Boolean} True if the vectors are equal, false otherwise.
         */
        equals(v) {
            return exactEquals$1(this, v);
        }
        /**
        * @function
        * @description Deep copy from this Vec2
        * @returns {Vec2} new Vec2
        */
        clone() {
            return new Vec2(this[0], this[1]);
        }
        /**
         * @function
         * @description generate Vec2 from Array
         * @param {Array} a
         * @param {Number} b index offset of a
         * @returns {Vec2} 
         */
        fromArray(a, o = 0) {
            this[0] = a[o];
            this[1] = a[o + 1];
            return this;
        }
    }

    /** 
     * @class Vec4
     * @description Four-Dimensional Vector Class
     * @param {Number} [x=0] The element of Vec4.x
     * @param {Number} [y=x] The element of Vec4.y
     * @param {Number} [z=x] The element of Vec4.z
     * @param {Number} [z=x] The element of Vec4.w
     * @example
     * // create a new Four-Dimensional Vector
     * new vec4(0, 0, 0, 0);
     */
    class Vec4 extends Array {
        constructor(x = 0, y = x, z = x, w = x) {
            super(x, y, z, w);
            return this;
        }

        get x() {
            return this[0];
        }

        set x(v) {
            this[0] = v;
        }

        get y() {
            return this[1];
        }

        set y(v) {
            this[1] = v;
        }

        get z() {
            return this[2];
        }

        set z(v) {
            this[2] = v;
        }

        get w() {
            return this[3];
        }

        set w(v) {
            this[3] = v;
        }
        /**
         * @function
         * @description Set the components of a vec4 to the given values
         * @param {Number} x
         * @param {Number} [y=x]
         * @param {Number} [z=x]
         * @param {Number} [w=x]
         */
        set(x, y=x, z=x, w=x) {
            set$2(this, x, y, z, w);
            return this;
        }
        /**
         * @function
         * @description generate vec4 from Array
         * @param {Array} a
         * @param {Number} o index offset of a
         * @returns {Vec4} 
         */
        fromArray(a, o = 0) {
    		this[0] = a[o];
    		this[1] = a[o + 1];
    		this[2] = a[o + 2];
    		this[3] = a[o + 3];
    		return this;
    	}
    }

    /** 
     * @class Color
     * @description Color Class
     * @param {Number} [r=0] The element of Color.r
     * @param {Number} [g=x] The element of Color.g
     * @param {Number} [b=x] The element of Color.b
     * @example
     * // create a new Three-Dimensional Vector
     * new Color();
     */
    class Color extends Array {
        constructor(r = 0, g = 0, b = 0) {
            if (typeof r === 'string') [r, g, b] = Color.hexToRGB(r);
            super(r, g, b);
            return this;
        }
        get r() {
            return this[0];
        }

        set r(v) {
            this[0] = v;
        }

        get g() {
            return this[1];
        }

        set g(v) {
            this[1] = v;
        }

        get b() {
            return this[2];
        }

        set b(v) {
            this[2] = v;
        }
        /**
         * @function
         * @description Set the components of Color to the given values
         * @param {Number} r
         * @param {Number} g
         * @param {Number} b
         * @returns {Color} 
         */
        set(r, g, b) {
            this[0] = r;
            this[1] = g;
            this[2] = b;
            return this;
        }
        /**
         * @function
         * @description Conversion hex format to rgb format
         * @param {String} hexValue
         * @returns {Array} 
         * @example
         * const rgb = Color.hexToRGB('#FFF');
         */
        static hexToRGB(hex) {
            if (hex.length === 4) hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
            const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!r) console.warn(`Unable to convert hex string ${hex} to rgb values`);
            return [
                parseInt(r[1], 16) / 255,
                parseInt(r[2], 16) / 255,
                parseInt(r[3], 16) / 255
            ];
        }
        /**
         * @function
         * @description Conversion rgb format to hex format
         * @param {Array} rgbValue
         * @returns {Array} 
         * @example
         * const hex = Color.rgbToHex([255,255,255]);
         */
        static rgbToHex(rgb) {
            if (!rgb.length || rgb.length != 3) console.error(`Unable to convert rgb array ${rgb} to hex value`);
            let resHexStr = '#';
            for (let index = 0; index < rgb.length; index++) {
                let hex = Number(rgb[index]).toString(16);
                if (hex.length < 2) {
                    hex = '0' + hex;
                }
                resHexStr += hex;
            }
            return resHexStr;
        }
        /**
          * @function
          * @description  Conversion hsl format to rgb format
          * https://en.wikipedia.org/wiki/HSL_and_HSV.
          * @param {Number} h hue(色相)
          * @param {Number} s saturation(饱和度)
          * @param {Number} l lightness(亮度)
          * @returns {Array} 
          * 
          * @example
          * const rgb = Color.hslToRGB(0.1,0.2,0.3);
          */
        static hslToRGB(h, s, l) {
            let r, g, b;
            if (s == 0) {
                r = g = b = l; // achromatic
            } else {
                let hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                let p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
        /**
          * @function
          * @description  Conversion rgb format to hsl format
          * https://en.wikipedia.org/wiki/HSL_and_HSV.
          * @param {Number} r
          * @param {Number} g 
          * @param {Number} b
          * @returns {Array} 
          * 
          * @example
          * const rgb = Color.rgbToHsl(255,255,255);
          */
        static rgbToHsl(r, g, b) {
            r /= 255, g /= 255, b /= 255;
            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            if (max == min) {
                h = s = 0; // achromatic
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, l];
        }
        /**
          * @function
          * @description  Conversion rgb format to hsv format
          * https://en.wikipedia.org/wiki/HSL_and_HSV
          * @param {Number} r
          * @param {Number} g 
          * @param {Number} b
          * @returns {Array} 
          */
        static rgbToHsv(r, g, b) {
            r = r / 255;
            g = g / 255;
            b = b / 255;
            let h, s, v;
            let min = Math.min(r, g, b);
            let max = v = Math.max(r, g, b);
            let difference = max - min;
        
            if (max == min) {
                h = 0;
            } else {
                switch (max) {
                case r:
                    h = (g - b) / difference + (g < b ? 6 : 0);
                    break;
                case g:
                    h = 2.0 + (b - r) / difference;
                    break;
                case b:
                    h = 4.0 + (r - g) / difference;
                    break;
                }
                h = Math.round(h * 60);
            }
            if (max == 0) {
                s = 0;
            } else {
                s = 1 - min / max;
            }
            s = Math.round(s * 100);
            v = Math.round(v * 100);
            return [h, s, v];
        }

        /**
         * @function
         * @description generate Color from Array
         * @param {Array} a
         * @param {Number} o index offset of a
         * @returns {Vec4} 
         */
        fromArray(a, o = 0) {
    		this[0] = a[o];
    		this[1] = a[o + 1];
    		this[2] = a[o + 2];
    		return this;
    	}
    }

    // Based from ThreeJS' OrbitControls class, rewritten using es6 with some additions and subtractions.

    const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, DOLLY_PAN: 3 };
    const MOURSE_BTTON = { left: 0, middle: 1, right: 2 };

    // Temp vec value
    const tempVec3$2 = new Vec3();
    const tempVec2a = new Vec2();
    const tempVec2b = new Vec2();
    // Record start value
    const rotateStart = new Vec2();
    const panStart = new Vec2();
    const dollyStart = new Vec2();

    function getZoomScale(zoomSpeed) {
        return Math.pow(0.95, zoomSpeed);
    }
    /**
     * Orbit controls allow the camera to orbit around a target
     * 
     * @class
     * @param {Camera} camera - The camera to be controlled
     * @param {Object} [options] -  The optional orbit parameters
     * @param {HTMLElement} [options.element=document] - The HTML element used for event listeners
     * @param {Boolean} [options.enabled=true]
     * @param {Vec3} [options.target=new Vec3()]
     * @param {Number} [options.ease=0.25]
     * @param {Number} [options.inertia=0.85]
     * @param {Boolean} [options.enableRotate=true]
     * @param {Number} [options.rotateSpeed=0.1]
     * @param {Boolean} [options.enableZoom=true]
     * @param {Number} [options.zoomSpeed=1]
     * @param {Boolean} [options.enablePan=true]
     * @param {Number} [options.panSpeed=0.1]
     * @param {Number} [options.minPolarAngle=0]
     * @param {Number} [options.maxPolarAngle=Math.PI]
     * @param {Number} [options.minAzimuthAngle=-Infinity]
     * @param {Number} [options.maxAzimuthAngle=Infinity]
     * @param {Number} [options.minDistance=0]
     * @param {Number} [options.maxDistance=Infinity]
     */
    class Orbit {
        constructor(camera, {
            element = document,
            enabled = true,
            target = new Vec3(),
            ease = 0.25,
            inertia = 0.85,
            enableRotate = true,
            rotateSpeed = 0.1,
            enableZoom = true,
            zoomSpeed = 1,
            enablePan = true,
            panSpeed = 0.1,
            minPolarAngle = 0,
            maxPolarAngle = Math.PI,
            minAzimuthAngle = -Infinity,
            maxAzimuthAngle = Infinity,
            minDistance = 0,
            maxDistance = Infinity,
        } = {}) {
            this.camera = camera;
            this.element = element;
            this.enabled = enabled;
            this.target = target;
            this.ease = ease || 1; // 1 so has no effect
            this.inertia = inertia || 1; // 1 so has no effect
            this.enableRotate = enableRotate;
            this.rotateSpeed = rotateSpeed;
            this.enableZoom = enableZoom;
            this.zoomSpeed = zoomSpeed;
            this.enablePan = enablePan;
            this.panSpeed = panSpeed;
            this.minPolarAngle = minPolarAngle;
            this.maxPolarAngle = maxPolarAngle;
            this.minAzimuthAngle = minAzimuthAngle;
            this.maxAzimuthAngle = maxAzimuthAngle;
            this.minDistance = minDistance;
            this.maxDistance = maxDistance;

            // current position in sphericalTarget coordinates
            const sphericalTarget = this.sphericalTarget = { radius: 1, phi: 0, theta: 0 };
            const spherical = this.spherical = { radius: 1, phi: 0, theta: 0 };
            this.sphericalDelta = { radius: 1, phi: 0, theta: 0 };
            this.panDelta = new Vec3();

            // Grab initial position values
            const offset = this.offset = new Vec3();
            offset.copy(camera.position).sub(this.target);
            // Spherical coordinate system (world is "y-axis-is-up" space)
            spherical.radius = sphericalTarget.radius = offset.distance();
            // Azimuth angle
            spherical.theta = sphericalTarget.theta = Math.atan2(offset.x, offset.z); //(y,x) => y/x
            // Polar angle
            spherical.phi = sphericalTarget.phi = Math.acos(Math.min(Math.max(offset.y / sphericalTarget.radius, -1), 1));

            this.addHandlers();
        }
        /**
        * Update the camera value
        */
        update() {
            const {
                sphericalTarget,
                sphericalDelta,
                minAzimuthAngle,
                maxAzimuthAngle,
                minPolarAngle,
                maxPolarAngle,
                minDistance,
                maxDistance,
                spherical,
                ease,
                target,
                panDelta,
                offset,
                camera,
                inertia,
            } = this;
            // apply delta
            sphericalTarget.radius *= sphericalDelta.radius;
            sphericalTarget.theta += sphericalDelta.theta;
            sphericalTarget.phi += sphericalDelta.phi;

            // apply boundaries
            sphericalTarget.theta = Math.max(minAzimuthAngle, Math.min(maxAzimuthAngle, sphericalTarget.theta));
            sphericalTarget.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, sphericalTarget.phi));
            sphericalTarget.radius = Math.max(minDistance, Math.min(maxDistance, sphericalTarget.radius));

            // ease values
            spherical.phi += (sphericalTarget.phi - spherical.phi) * ease;
            spherical.theta += (sphericalTarget.theta - spherical.theta) * ease;
            spherical.radius += (sphericalTarget.radius - spherical.radius) * ease;

            // apply pan to target. As offset is relative to target, it also shifts
            target.add(panDelta);

            // apply rotation to offset
            let sinPhiRadius = spherical.radius * Math.sin(Math.max(0.000001, spherical.phi));
            offset.x = sinPhiRadius * Math.sin(spherical.theta);
            offset.y = spherical.radius * Math.cos(spherical.phi);
            offset.z = sinPhiRadius * Math.cos(spherical.theta);

            // Apply updated values to object
            camera.position.copy(target).add(offset);
            camera.lookAt(target);

            // Apply inertia to values
            sphericalDelta.theta *= inertia;
            sphericalDelta.phi *= inertia;
            panDelta.multiply(inertia);

            // Reset scale every frame to avoid applying scale multiple times
            sphericalDelta.radius = 1;
        }
        /**
        * Add event handlers 
        * every event handler just for updating panDelta and sphericalDelta
        * the orbit is enough to calculating with this two value
        */
        addHandlers() {
            const { element } = this;
            element.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
            element.addEventListener('mousedown', this.onMouseDown.bind(this), false);
            window.addEventListener('wheel', this.onMouseWheel.bind(this), false);
            element.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
            element.addEventListener('touchend', this.onTouchEnd.bind(this), false);
            element.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        }

        /**
        * Right click event handler
        */
        onContextMenu(e) {
            if (!this.enabled) return;
            e.preventDefault();
        }

        /**
        * Mouse down event handler
        */
        onMouseDown(e) {
            if (!this.enabled) return;
            switch (e.button) {
                // Left click
                case MOURSE_BTTON.left:
                    if (this.enableRotate === false) return;
                    rotateStart.set(e.clientX, e.clientY);
                    this.state = STATE.ROTATE;
                    break;
                // Middle scroll
                case   MOURSE_BTTON.middle:
                    if (this.enableZoom === false) return;
                    dollyStart.set(e.clientX, e.clientY);
                    this.state = STATE.DOLLY;
                    break;
                // Right click
                case MOURSE_BTTON.right:
                    if (this.enablePan === false) return;
                    panStart.set(e.clientX, e.clientY);
                    this.state = STATE.PAN;
                    break;
            }
            if (this.state !== STATE.NONE) {
                // Begin listen mousemove and up event
                window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
                window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
            }
        }

        /**
        * Mouse move event handler
        */
        onMouseMove(e) {
            if (!this.enabled) return;
            switch (this.state) {
                case STATE.ROTATE:
                    if (this.enableRotate === false) return;
                    this.handleMoveRotate(e.clientX, e.clientY);
                    break;
                case STATE.DOLLY:
                    if (this.enableZoom === false) return;
                    this.handleMouseMoveDolly(e);
                    break;
                case STATE.PAN:
                    if (this.enablePan === false) return;
                    this.handleMovePan(e.clientX, e.clientY);
                    break;
            }
        }

        /**
        * Mouse up event handler
        */
        onMouseUp() {
            if (!this.enabled) return;
            document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
            document.removeEventListener('mouseup', this.onMouseUp.bind(this), false);
            this.state = STATE.NONE;
        }

        /**
        * Handle left click + mouse move event
        */
        handleMoveRotate(x, y) {
            tempVec2a.set(x, y);
            tempVec2b.sub(tempVec2a, rotateStart).multiply(this.rotateSpeed);
            let el = this.element === document ? document.body : this.element;
            this.sphericalDelta.theta -= 2 * Math.PI * tempVec2b.x / el.clientHeight;
            this.sphericalDelta.phi -= 2 * Math.PI * tempVec2b.y / el.clientHeight;
            rotateStart.copy(tempVec2a);
        }

        /**
        * Handle midlle click + mouse move event
        */
        handleMouseMoveDolly(e) {
            tempVec2a.set(e.clientX, e.clientY);
            tempVec2b.sub(tempVec2a, dollyStart);
            if (tempVec2b.y > 0) { // Up scroll
                this.dolly(getZoomScale(this.zoomSpeed));
            } else if (tempVec2b.y < 0) { // Dwon scroll
                this.dolly(1 / getZoomScale(this.zoomSpeed));
            }
            dollyStart.copy(tempVec2a);
        }
        dolly(dollyScale) {
            this.sphericalDelta.radius /= dollyScale;
        }

        /**
        * Handle right click + mouse move event
        */
        handleMovePan(x, y) {
            tempVec2a.set(x, y);
            tempVec2b.sub(tempVec2a, panStart).multiply(this.panSpeed); //计算变化向量
            this.pan(tempVec2b.x, tempVec2b.y);
            panStart.copy(tempVec2a);
        }
        pan(deltaX, deltaY) {
            let { element, camera } = this;
            let el = element === document ? document.body : element;
            // perspective
            tempVec3$2.copy(camera.position).sub(this.target);
            let targetDistance = tempVec3$2.distance();

            // half of the fov is center to top of screen
            targetDistance *= Math.tan(((camera.fov || 45) / 2) * Math.PI / 180.0); //投影高度

            // we use only clientHeight here so aspect ratio does not distort speed
            this.panLeft( deltaX * 2 * targetDistance / el.clientHeight, camera.matrix); //高度比值
            this.panUp( deltaY * 2 * targetDistance / el.clientHeight, camera.matrix);
        };
        panLeft(distance, m) {
            tempVec3$2.set(m[0], m[1], m[2]); //X
            tempVec3$2.multiply(-distance);
            this.panDelta.add(tempVec3$2);
        }
        panUp(distance, m) {
            tempVec3$2.set(m[4], m[5], m[6]); //Y
            tempVec3$2.multiply(distance);
            this.panDelta.add(tempVec3$2);
        }

        /**
        * Handle mourse wheel event
        */
        onMouseWheel(e) {
            const { enabled, enableZoom, state } = this;
            if (!enabled || !enableZoom || (state !== STATE.NONE && state !== STATE.ROTATE)) return;
            e.preventDefault();//Warning passive
            e.stopPropagation();

            if (e.deltaY < 0) {
                this.dolly(1 / getZoomScale(this.zoomSpeed));
            } else if (e.deltaY > 0) {
                this.dolly(getZoomScale(this.zoomSpeed));
            }
        }

        /**
        * Handle mobile touch start event
        */
        onTouchStart(e) {
            if (!this.enabled) return;
            e.preventDefault();
            switch (e.touches.length) {
                case 1:
                    if (this.enableRotate === false) return;
                    rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
                    this.state = STATE.ROTATE;
                    break;
                case 2:
                    if (this.enableZoom === false && this.enablePan === false) return;
                    this.handleTouchStartDollyPan(e);
                    this.state = STATE.DOLLY_PAN;
                    break;
                default:
                    this.state = STATE.NONE;
            }
        }

        /**
        * Deal mobile touch start dolly and pan
        */
        handleTouchStartDollyPan(e) {
            if (this.enableZoom) {
                let dx = e.touches[0].pageX - e.touches[1].pageX;
                let dy = e.touches[0].pageY - e.touches[1].pageY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                dollyStart.set(0, distance);
            }

            if (this.enablePan) {
                let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
                let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
                panStart.set(x, y);
            }
        }

        /**
        * Deal mobile touch move dolly and pan
        */
        handleTouchMoveDollyPan(e) {
            if (this.enableZoom) {
                let dx = e.touches[0].pageX - e.touches[1].pageX;
                let dy = e.touches[0].pageY - e.touches[1].pageY;
                let distance = Math.sqrt(dx * dx + dy * dy);
                tempVec2a.set(0, distance);
                tempVec2b.set(0, Math.pow(tempVec2a.y / dollyStart.y, this.zoomSpeed));
                this.dolly(tempVec2b.y);
                dollyStart.copy(tempVec2a);
            }

            if (this.enablePan) {
                let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
                let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
                this.handleMovePan(x, y);
            }
        }

        /**
        * Handle mobile touch move event
        */
        onTouchMove(e) {
            if (!this.enabled) return;
            e.preventDefault();
            e.stopPropagation();

            switch (e.touches.length) {
                case 1:
                    if (this.enableRotate === false) return;
                    this.handleMoveRotate(e.touches[0].pageX, e.touches[0].pageY);
                    break;
                case 2:
                    if (this.enableZoom === false && this.enablePan === false) return;
                    this.handleTouchMoveDollyPan(e);
                    break;
                default:
                    this.state = STATE.NONE;
            }
        }

        /**
       * Handle mobile touch end event
       */
        onTouchEnd() {
            if (!this.enabled) return;
            this.state = STATE.NONE;
        };

        /**
        * Remove event handlers
        */
        removeHandler() {
            element.removeEventListener('contextmenu', this.onContextMenu, false);
            element.removeEventListener('mousedown', this.onMouseDown, false);
            window.removeEventListener('wheel', this.onMouseWheel, false);
            element.removeEventListener('touchstart', this.onTouchStart, false);
            element.removeEventListener('touchend', this.onTouchEnd, false);
            element.removeEventListener('touchmove', this.onTouchMove, false);
            window.removeEventListener('mousemove', this.onMouseMove, false);
            window.removeEventListener('mouseup', this.onMouseUp, false);
        }
    }

    // Core

    exports.Camera = Camera;
    exports.Color = Color;
    exports.Euler = Euler;
    exports.Geometry = Geometry;
    exports.Mat3 = Mat3;
    exports.Mat4 = Mat4;
    exports.Mesh = Mesh;
    exports.Orbit = Orbit;
    exports.Program = Program;
    exports.Quat = Quat;
    exports.RenderTarget = RenderTarget;
    exports.Renderer = Renderer;
    exports.Texture = Texture;
    exports.Transform = Transform;
    exports.Vec2 = Vec2;
    exports.Vec3 = Vec3;
    exports.Vec4 = Vec4;

    return exports;

}({}));
