var Loader = (function (exports) {
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

    // Temp vec value
    const tempVec3$2 = new Vec3();
    const tempVec2a = new Vec2();
    const tempVec2b = new Vec2();
    // Record start value
    const rotateStart = new Vec2();
    const panStart = new Vec2();
    const dollyStart = new Vec2();

    // Core

    const prevPos = new Vec3();
    const prevRot = new Quat();
    const prevScl = new Vec3();

    const nextPos = new Vec3();
    const nextRot = new Quat();
    const nextScl = new Vec3();

    class Animation {
        constructor({objects, data}) {
            this.objects = objects;
            this.data = data;
            console.log(data[0]);
            console.log(data[0].length);
            this.elapsed = 0;
            this.weight = 1;
            this.duration = data.length - 1;
        }

        update(totalWeight = 1, isSet) {
            const weight = isSet ? 1 : this.weight / totalWeight;
            const elapsed = this.elapsed % this.duration;

            const floorFrame = Math.floor(elapsed);
            const blend = elapsed - floorFrame;
            const prevKey = this.data[floorFrame];
            const nextKey = this.data[(floorFrame + 1) % this.duration];

            //可以这样直接foreach的条件是每一帧frameData已经包含了这一帧所有的bones位置
            this.objects.forEach((object, i) => {
                prevPos.fromArray(prevKey.position, i * 3);
                prevRot.fromArray(prevKey.quaternion, i * 4);
                prevScl.fromArray(prevKey.scale, i * 3);

                nextPos.fromArray(nextKey.position, i * 3);
                nextRot.fromArray(nextKey.quaternion, i * 4);
                nextScl.fromArray(nextKey.scale, i * 3);

                prevPos.lerp(nextPos, blend);
                prevRot.slerp(nextRot, blend);
                prevScl.lerp(nextScl, blend);

                object.position.lerp(prevPos, weight);
                object.quaternion.slerp(prevRot, weight);
                object.scale.lerp(prevScl, weight);
            });
        }
    }

    const tempMat4$1 = new Mat4();

    class Skin extends Mesh {
        constructor(gl, {
            geometry,
            program,
            mode = gl.TRIANGLES,
        } = {}) {
            super(gl, {geometry, program, mode});
            this.animations = [];
        }

        init(rig = {}){
            this.createBones(rig);
            this.createBoneTexture();
        }
        
        createBones(rig) {
            let { bones, boneInverses } = rig;
            if (!bones || !bones.length) return;
            this.root = bones[0];
            this.bones = bones.slice(0);
            // Store inverse of bind pose to calculate differences
            if (boneInverses && boneInverses.length === bones.length) {
                this.bones.forEach((bone,i) => {
                    bone.bindInverse = boneInverses[i];
                });
            }else{
                console.warn('No input boneInverses or boneInverses is the wrong length.');
                this.bones.forEach(bone => {
                    bone.bindInverse = new Mat4(bone.worldMatrix).inverse();
                });
            }
        }

        createBoneTexture() {
            if (!this.bones.length) return;
            // layout (1 matrix = 4 pixels)  => use texture to save boneMatrices data
            //      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
            //  with  8x8  pixel texture max   16 bones * 4 pixels =  (8 * 8)
            //       16x16 pixel texture max   64 bones * 4 pixels = (16 * 16)
            //       32x32 pixel texture max  256 bones * 4 pixels = (32 * 32)
            //       64x64 pixel texture max 1024 bones * 4 pixels = (64 * 64)
            // let size = Math.sqrt( bones.length * 4 ); // 4 pixels needed for 1 matrix
            // size = _Math.ceilPowerOfTwo( size );
            // size = Math.max( size, 4 );
            const size = Math.max(4, Math.pow(2, Math.ceil(Math.log(Math.sqrt(this.bones.length * 4)) / Math.LN2)));
            this.boneMatrices = new Float32Array(size * size * 4);
            this.boneTextureSize = size;
            this.boneTexture = new Texture(this.gl, {
                image: this.boneMatrices,
                generateMipmaps: false,
                type: this.gl.FLOAT,
                internalFormat: this.gl.renderer.isWebgl2 ? this.gl.RGBA16F : this.gl.RGBA,
                flipY: false,
                width: size,
            });
            // pass to shader
            Object.assign(this.program.uniforms, {
                boneTexture: {value: this.boneTexture},
                boneTextureSize: {value: this.boneTextureSize},
            });
        }

        addAnimation(data) {
            const animation = new Animation({objects: this.bones, data});
            this.animations.push(animation);
            return animation;
        }

        update() {
            // Calculate combined animation weight
            let total = 0;
            if(!this.animations.length) return;
            this.animations.forEach(animation => total += animation.weight);
            this.animations.forEach((animation, i) => {
                // force first animation to set in order to reset frame
                animation.update(total, i === 0);
            });
        }

        draw({
            camera,
        } = {}) {
            // Calling 'update' updates the bones with all of the
            // attached animations based on their weights.
            this.update();
            // Update world matrices manually, as not part of scene graph
            this.root.updateMatrixWorld(true);

            // Update bone texture
            this.bones.forEach((bone, i) => {
                // Find difference between current and bind pose
                tempMat4$1.multiply(bone.worldMatrix, bone.bindInverse);
                this.boneMatrices.set(tempMat4$1, i * 16);
            });
            // update the boneMatrices change to shader
            if (this.boneTexture) this.boneTexture.needsUpdate = true;

            super.draw({camera});
        }
    }

    function extractUrlBase(url) {
    	let index = url.lastIndexOf('/');
    	if (index === - 1) return './';
    	return url.substr(0, index + 1); //Get assets folder url
    }

    function decodeText(array) {
    	if (typeof TextDecoder !== 'undefined') {
    		return new TextDecoder().decode(array);
    	} else {
    		console.error("no TextDecoder support");
    	}
    }

    //Todo
    function GLTFRegistry() {
        let objects = {};
        return	{
            get: function ( key ) {
                return objects[ key ];
            },
            add: function ( key, object ) {
                objects[ key ] = object;
            },
            remove: function ( key ) {
                delete objects[ key ];
            },
            removeAll: function () {
                objects = {};
            }
        };
    }

    function resolveURL( url, path ) {
        // Invalid URL
        if ( typeof url !== 'string' || url === '' ) return '';
        // Absolute URL http://,https://,//
        if ( /^(https?:)?\/\//i.test( url ) ) return url;
        // Data URI
        if ( /^data:.*,.*$/i.test( url ) ) return url;
        // Blob URL
        if ( /^blob:.*$/i.test( url ) ) return url;
        // Relative URL
        return path + url;
    }

    function definesToString(defines) {
        var outStr = '';
        for (var def in defines) {
            outStr += '#define ' + def + ' ' + defines[def] + '\n';
        }
        return outStr;
    }

    const WEBGL_TYPE_SIZES = {
        'SCALAR': 1,
        'VEC2': 2,
        'VEC3': 3,
        'VEC4': 4,
        'MAT2': 4,
        'MAT3': 9,
        'MAT4': 16
    };

    const WEBGL_COMPONENT_TYPES = {
        5120: Int8Array,
        5121: Uint8Array,
        5122: Int16Array,
        5123: Uint16Array,
        5125: Uint32Array,
        5126: Float32Array
    };

    const ALPHA_MODES = {
        OPAQUE: 'OPAQUE',
        MASK: 'MASK',
        BLEND: 'BLEND'
    };


    const ATTRIBUTES = {
        POSITION: 'position',
        NORMAL: 'normal',
        TEXCOORD_0: 'uv',
        TANGENT: 'tangent',
        TEXCOORD0: 'uv', // deprecated
        TEXCOORD: 'uv', // deprecated
        TEXCOORD_1: 'uv2',
        COLOR_0: 'color',
        COLOR0: 'color', // deprecated
        COLOR: 'color', // deprecated
        WEIGHTS_0: 'skinWeight',
        WEIGHT: 'skinWeight', // deprecated
        JOINTS_0: 'skinIndex',
        JOINT: 'skinIndex' // deprecated
    };

    const WEBGL_CONSTANTS = {
        FLOAT: 5126,
        //FLOAT_MAT2: 35674,
        FLOAT_MAT3: 35675,
        FLOAT_MAT4: 35676,
        FLOAT_VEC2: 35664,
        FLOAT_VEC3: 35665,
        FLOAT_VEC4: 35666,
        LINEAR: 9729,
        REPEAT: 10497,
        SAMPLER_2D: 35678,
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6,
        UNSIGNED_BYTE: 5121,
        UNSIGNED_SHORT: 5123
    };

    class BufferAttribute {
    	constructor(array, itemSize, normalized){
    		this.data = array;
    		this.size = itemSize;
    		this.count = array !== undefined ? array.length / itemSize : 0;
    		this.normalize = normalized === true;
    	}

    	setArray(array){
    		this.count = array !== undefined ? array.length / this.itemSize : 0;
    		this.data = array;
    		return this;
    	}

    	set(value, offset) {
    		if ( offset === undefined ) offset = 0;
    		this.data.set( value, offset );
    		return this;
    	}

    	getX(index){
    		return this.data[ index * this.itemSize ];
    	}

    	setX(index, x){
    		this.data[ index * this.itemSize ] = x;
    		return this;
    	}

    	getY(index){
    		return this.data[ index * this.itemSize + 1 ];
    	}

    	setY(index, y){
    		this.data[ index * this.itemSize + 1 ] = y;
    		return this;
    	}

    	getZ(index){
    		return this.data[ index * this.itemSize + 2 ];
    	}

    	setZ(index, z){
    		this.data[ index * this.itemSize + 2 ] = z;
    		return this;
    	}

    	getW(index){
    		return this.data[ index * this.itemSize + 3 ];
    	}

    	setW(index, w){
    		this.data[ index * this.itemSize + 3 ] = w;
    		return this;
    	}

    	setXY(index, x, y){
    		index *= this.itemSize;
    		this.data[ index + 0 ] = x;
    		this.data[ index + 1 ] = y;
    		return this;
    	}

    	setXYZ(index, x, y, z){
    		index *= this.itemSize;
    		this.data[ index + 0 ] = x;
    		this.data[ index + 1 ] = y;
    		this.data[ index + 2 ] = z;
    		return this;
    	}

    	setXYZW(index, x, y, z, w){
    		index *= this.itemSize;
    		this.data[ index + 0 ] = x;
    		this.data[ index + 1 ] = y;
    		this.data[ index + 2 ] = z;
    		this.data[ index + 3 ] = w;
    		return this;
    	}

    	clone(){
    		return new this.constructor( this.data, this.itemSize ).copy( this );
    	}
    }

    const vertex = `
precision highp float;
precision highp int;

in vec3 position;
#ifdef HAS_NORMALS
in vec3 normal;
#endif
#ifdef HAS_TANGENTS
in vec4 tangent;
#endif
#ifdef HAS_UV
in vec2 uv;
#endif

#ifdef USE_SKINNING
in vec4 skinIndex;
in vec4 skinWeight;

uniform sampler2D boneTexture;
uniform int boneTextureSize;

mat4 getBoneMatrix(const in float i) {
    float j = i * 4.0;
    float x = mod(j, float(boneTextureSize));
    float y = floor(j / float(boneTextureSize));

    float dx = 1.0 / float(boneTextureSize);
    float dy = 1.0 / float(boneTextureSize);

    y = dy * (y + 0.5);

    vec4 v1 = texture(boneTexture, vec2(dx * (x + 0.5), y));
    vec4 v2 = texture(boneTexture, vec2(dx * (x + 1.5), y));
    vec4 v3 = texture(boneTexture, vec2(dx * (x + 2.5), y));
    vec4 v4 = texture(boneTexture, vec2(dx * (x + 3.5), y));

    return mat4(v1, v2, v3, v4);
}
#endif

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec2 vUv;
out vec3 vPosition;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
out mat3 vTBN;
#endif
out vec3 vNormal;
#endif

void main() {
    vec4 pos = modelMatrix * vec4(position,1.0);
    vPosition = vec3(pos.xyz) / pos.w;

    #ifdef HAS_NORMALS
    #ifdef HAS_TANGENTS
    vec3 normalW = normalize(vec3(normalMatrix * vec3(normal.xyz)));
    vec3 tangentW = normalize(vec3(modelMatrix * vec4(tangent.xyz, 0.0)));
    vec3 bitangentW = cross(normalW, tangentW) * tangent.w;
    vTBN = mat3(tangentW, bitangentW, normalW);
    #else
    vNormal = normalize(vec3(modelMatrix * vec4(normal.xyz, 0.0)));
    #endif
    #endif

    #ifdef HAS_UV
    vUv = uv;
    #else
    vUv = vec2(0.,0.);
    #endif

    #ifdef USE_SKINNING
    vNormal = normalize(normalMatrix * normal);
    mat4 boneMatX = getBoneMatrix(skinIndex.x);
    mat4 boneMatY = getBoneMatrix(skinIndex.y);
    mat4 boneMatZ = getBoneMatrix(skinIndex.z);
    mat4 boneMatW = getBoneMatrix(skinIndex.w);

    // update normal
    mat4 skinMatrix = mat4(0.0);
    skinMatrix += skinWeight.x * boneMatX;
    skinMatrix += skinWeight.y * boneMatY;
    skinMatrix += skinWeight.z * boneMatZ;
    skinMatrix += skinWeight.w * boneMatW;
    vNormal = vec4(skinMatrix * vec4(vNormal, 0.0)).xyz;

    // Update position
    vec4 bindPos = vec4(position, 1.0);
    vec4 transformed = vec4(0.0);
    transformed += boneMatX * bindPos * skinWeight.x;
    transformed += boneMatY * bindPos * skinWeight.y;
    transformed += boneMatZ * bindPos * skinWeight.z;
    transformed += boneMatW * bindPos * skinWeight.w;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed.xyz, 1.0);
    #else
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #endif
}
`;

    //
    // This fragment shader defines a reference implementation for Physically Based Shading of
    // a microfacet surface material defined by a glTF model.
    //
    // References:
    // [1] Real Shading in Unreal Engine 4
    //     http://blog.selfshadow.com/publications/s2013-shading-course/karis/s2013_pbs_epic_notes_v2.pdf
    // [2] Physically Based Shading at Disney
    //     http://blog.selfshadow.com/publications/s2012-shading-course/burley/s2012_pbs_disney_brdf_notes_v3.pdf
    // [3] README.md - Environment Maps
    //     https://github.com/KhronosGroup/glTF-WebGL-PBR/#environment-maps
    // [4] "An Inexpensive BRDF Model for Physically based Rendering" by Christophe Schlick
    //     https://www.cs.virginia.edu/~jdl/bib/appearance/analytic%20models/schlick94b.pdf

    const fragment = `
precision highp float;
precision highp int;

in vec3 vPosition;
in vec2 vUv;

#ifdef HAS_NORMALS
#ifdef HAS_TANGENTS
in mat3 vTBN;
#else
in vec3 vNormal;
#endif
#endif

#ifdef USE_IBL
// uniform sampler2D u_brdfLUT;
// uniform samplerCube u_DiffuseEnvSampler;
// uniform samplerCube u_SpecularEnvSampler;
uniform sampler2D tLUT;
uniform samplerCube tEnvDiffuse;
uniform samplerCube tEnvSpecular;
#endif

#ifdef HAS_BASECOLORMAP
uniform sampler2D u_BaseColorSampler;
#endif
#ifdef HAS_NORMALMAP
uniform sampler2D u_NormalSampler;
uniform float u_NormalScale;
#endif
#ifdef HAS_EMISSIVEMAP
uniform sampler2D u_EmissiveSampler;
uniform vec3 u_EmissiveFactor;
#endif
#ifdef HAS_METALROUGHNESSMAP
uniform sampler2D u_MetallicRoughnessSampler;
#endif
#ifdef HAS_OCCLUSIONMAP
uniform sampler2D u_OcclusionSampler;
uniform float u_OcclusionStrength;
#endif

uniform vec2 u_MetallicRoughnessValues;
uniform vec4 u_BaseColorFactor;
uniform vec3 cameraPosition;

// debugging flags used for shader output of intermediate PBR variables
vec4 u_ScaleDiffBaseMR = vec4(0.0, 0.0, 0.0, 0.0);
vec4 u_ScaleFGDSpec = vec4(0.0, 0.0, 0.0, 0.0);
vec4 u_ScaleIBLAmbient = vec4(1.0, 1.0, 1.0, 1.0);

// Light(Test)
vec3 lightPos = vec3(0.0,5.0,0.0);
vec3 u_LightColor = vec3(1.0,1.0,1.0);

const float PI = 3.14159265359;
const float RECIPROCAL_PI = 0.31830988618;
const float RECIPROCAL_PI2 = 0.15915494;
const float LN2 = 0.6931472;
const float ENV_LODS = 6.0;

out vec4 FragColor;

// Encapsulate the various inputs used by the various functions in the shading equation
// We store values in this struct to simplify the integration of alternative implementations
// of the shading terms, outlined in the Readme.MD Appendix.
struct PBRInfo
{
    float NdotL;                  // cos angle between normal and light direction
    float NdotV;                  // cos angle between normal and view direction
    float NdotH;                  // cos angle between normal and half vector
    float LdotH;                  // cos angle between light direction and half vector
    float VdotH;                  // cos angle between view direction and half vector
    float perceptualRoughness;    // roughness value, as authored by the model creator (input to shader)
    float metalness;              // metallic value at the surface
    vec3 reflectance0;            // full reflectance color (normal incidence angle)
    vec3 reflectance90;           // reflectance color at grazing angle
    float alphaRoughness;         // roughness mapped to a more linear change in the roughness (proposed by [2])
    vec3 diffuseColor;            // color contribution from diffuse lighting
    vec3 specularColor;           // color contribution from specular lighting
};

const float M_PI = 3.141592653589793;
const float c_MinRoughness = 0.04;

vec4 SRGBtoLINEAR(vec4 srgbIn)
{
    #ifdef MANUAL_SRGB
    #ifdef SRGB_FAST_APPROXIMATION
    vec3 linOut = pow(srgbIn.xyz,vec3(2.2));
    #else //SRGB_FAST_APPROXIMATION
    vec3 bLess = step(vec3(0.04045),srgbIn.xyz);
    vec3 linOut = mix( srgbIn.xyz/vec3(12.92), pow((srgbIn.xyz+vec3(0.055))/vec3(1.055),vec3(2.4)), bLess );
    #endif //SRGB_FAST_APPROXIMATION
    return vec4(linOut,srgbIn.w);;
    #else //MANUAL_SRGB
    return srgbIn;
    #endif //MANUAL_SRGB
}

vec4 RGBMToLinear(in vec4 value) {
    float maxRange = 6.0;
    return vec4(value.xyz * value.w * maxRange, 1.0);
}

vec2 cartesianToPolar(vec3 n) {
    vec2 uv;
    uv.x = atan(n.z, n.x) * RECIPROCAL_PI2 + 0.5;
    uv.y = asin(n.y) * RECIPROCAL_PI + 0.5;
    return uv;
}

// Find the normal for this fragment, pulling either from a predefined normal map
// or from the interpolated mesh normal and tangent attributes.
vec3 getNormal()
{
    // Retrieve the tangent space matrix
    #ifndef HAS_TANGENTS
    vec3 pos_dx = dFdx(vPosition);
    vec3 pos_dy = dFdy(vPosition);
    vec3 tex_dx = dFdx(vec3(vUv, 0.0));
    vec3 tex_dy = dFdy(vec3(vUv, 0.0));
    vec3 t = (tex_dy.t * pos_dx - tex_dx.t * pos_dy) / (tex_dx.s * tex_dy.t - tex_dy.s * tex_dx.t);

    #ifdef HAS_NORMALS
    vec3 ng = normalize(vNormal);
    #else
    vec3 ng = cross(pos_dx, pos_dy);
    #endif

    t = normalize(t - ng * dot(ng, t));
    vec3 b = normalize(cross(ng, t));
    mat3 tbn = mat3(t, b, ng);
    #else // HAS_TANGENTS
    mat3 tbn = vTBN;
    #endif

    #ifdef HAS_NORMALMAP
    vec3 n = texture(u_NormalSampler, vUv).rgb;
    n = normalize(tbn * ((2.0 * n - 1.0) * vec3(u_NormalScale, u_NormalScale, 1.0)));
    #else
    // The tbn matrix is linearly interpolated, so we need to re-normalize
    vec3 n = normalize(tbn[2].xyz);
    #endif

    return n;
}

// Calculation of the lighting contribution from an optional Image Based Light source.
// Precomputed Environment Maps are required uniform inputs and are computed as outlined in [1].
// See our README.md on Environment Maps [3] for additional discussion.
#ifdef USE_IBL
vec3 getIBLContribution(PBRInfo pbrInputs, vec3 n, vec3 reflection)
{
    float mipCount = 9.0; // resolution of 512x512
    float lod = (pbrInputs.perceptualRoughness * mipCount);
    // retrieve a scale and bias to F0. See [1], Figure 3
    vec3 brdf = SRGBtoLINEAR(texture(tLUT, vec2(pbrInputs.NdotV, 1.0 - pbrInputs.perceptualRoughness))).rgb;
    // CubeMap
    vec3 diffuseLight = SRGBtoLINEAR(texture(tEnvDiffuse, n)).rgb;
    // RGBM Texture
    // vec3 diffuseLight = RGBMToLinear(texture(tEnvDiffuse, cartesianToPolar(n))).rgb;

    #ifdef USE_TEX_LOD
    vec3 specularLight = SRGBtoLINEAR(textureCubeLodEXT(tEnvSpecular, reflection, lod)).rgb;
    #else
    vec3 specularLight = SRGBtoLINEAR(texture(tEnvSpecular, reflection)).rgb;
    #endif

    vec3 diffuse = diffuseLight * pbrInputs.diffuseColor;
    vec3 specular = specularLight * (pbrInputs.specularColor * brdf.x + brdf.y);

    // For presentation, this allows us to disable IBL terms
    diffuse *= u_ScaleIBLAmbient.x;
    specular *= u_ScaleIBLAmbient.y;

    return diffuse + specular;
}
#endif


// Basic Lambertian diffuse
// Implementation from Lambert's Photometria https://archive.org/details/lambertsphotome00lambgoog
// See also [1], Equation 1
vec3 diffuse(PBRInfo pbrInputs)
{
    return pbrInputs.diffuseColor / M_PI;
}

// The following equation models the Fresnel reflectance term of the spec equation (aka F())
// Implementation of fresnel from [4], Equation 15
vec3 specularReflection(PBRInfo pbrInputs)
{
    return pbrInputs.reflectance0 + (pbrInputs.reflectance90 - pbrInputs.reflectance0) * pow(clamp(1.0 - pbrInputs.VdotH, 0.0, 1.0), 5.0);
}

// This calculates the specular geometric attenuation (aka G()),
// where rougher material will reflect less light back to the viewer.
// This implementation is based on [1] Equation 4, and we adopt their modifications to
// alphaRoughness as input as originally proposed in [2].
float geometricOcclusion(PBRInfo pbrInputs)
{
    float NdotL = pbrInputs.NdotL;
    float NdotV = pbrInputs.NdotV;
    float r = pbrInputs.alphaRoughness;

    float attenuationL = 2.0 * NdotL / (NdotL + sqrt(r * r + (1.0 - r * r) * (NdotL * NdotL)));
    float attenuationV = 2.0 * NdotV / (NdotV + sqrt(r * r + (1.0 - r * r) * (NdotV * NdotV)));
    return attenuationL * attenuationV;
}

// The following equation(s) model the distribution of microfacet normals across the area being drawn (aka D())
// Implementation from "Average Irregularity Representation of a Roughened Surface for Ray Reflection" by T. S. Trowbridge, and K. P. Reitz
// Follows the distribution function recommended in the SIGGRAPH 2013 course notes from EPIC Games [1], Equation 3.
float microfacetDistribution(PBRInfo pbrInputs)
{
    float roughnessSq = pbrInputs.alphaRoughness * pbrInputs.alphaRoughness;
    float f = (pbrInputs.NdotH * roughnessSq - pbrInputs.NdotH) * pbrInputs.NdotH + 1.0;
    return roughnessSq / (M_PI * f * f);
}

void main()
{
    vec3 u_LightDirection = normalize(lightPos - vPosition);
    // Metallic and Roughness material properties are packed together
    // In glTF, these factors can be specified by fixed scalar values
    // or from a metallic-roughness map
    float perceptualRoughness = u_MetallicRoughnessValues.y;
    float metallic = u_MetallicRoughnessValues.x;
    #ifdef HAS_METALROUGHNESSMAP
    // Roughness is stored in the 'g' channel, metallic is stored in the 'b' channel.
    // This layout intentionally reserves the 'r' channel for (optional) occlusion map data
    vec4 mrSample = texture(u_MetallicRoughnessSampler, vUv);
    perceptualRoughness = mrSample.g * perceptualRoughness;
    metallic = mrSample.b * metallic;
    #endif
    perceptualRoughness = clamp(perceptualRoughness, c_MinRoughness, 1.0);
    metallic = clamp(metallic, 0.0, 1.0);
    // Roughness is authored as perceptual roughness; as is convention,
    // convert to material roughness by squaring the perceptual roughness [2].
    float alphaRoughness = perceptualRoughness * perceptualRoughness;

    // The albedo may be defined from a base texture or a flat color
    #ifdef HAS_BASECOLORMAP
    vec4 baseColor = SRGBtoLINEAR(texture(u_BaseColorSampler, vUv)) * u_BaseColorFactor;
    #else
    vec4 baseColor = u_BaseColorFactor;
    #endif

    vec3 f0 = vec3(0.04);
    vec3 diffuseColor = baseColor.rgb * (vec3(1.0) - f0);
    diffuseColor *= 1.0 - metallic;
    vec3 specularColor = mix(f0, baseColor.rgb, metallic);

    // Compute reflectance.
    float reflectance = max(max(specularColor.r, specularColor.g), specularColor.b);

    // For typical incident reflectance range (between 4% to 100%) set the grazing reflectance to 100% for typical fresnel effect.
    // For very low reflectance range on highly diffuse objects (below 4%), incrementally reduce grazing reflecance to 0%.
    float reflectance90 = clamp(reflectance * 25.0, 0.0, 1.0);
    vec3 specularEnvironmentR0 = specularColor.rgb;
    vec3 specularEnvironmentR90 = vec3(1.0, 1.0, 1.0) * reflectance90;

    vec3 n = getNormal();                             // normal at surface point
    vec3 v = normalize(cameraPosition - vPosition);        // Vector from surface point to camera
    vec3 l = normalize(u_LightDirection);             // Vector from surface point to light
    vec3 h = normalize(l+v);                          // Half vector between both l and v
    vec3 reflection = -normalize(reflect(v, n));

    float NdotL = clamp(dot(n, l), 0.001, 1.0);
    float NdotV = clamp(abs(dot(n, v)), 0.001, 1.0);
    float NdotH = clamp(dot(n, h), 0.0, 1.0);
    float LdotH = clamp(dot(l, h), 0.0, 1.0);
    float VdotH = clamp(dot(v, h), 0.0, 1.0);

    PBRInfo pbrInputs = PBRInfo(
        NdotL,
        NdotV,
        NdotH,
        LdotH,
        VdotH,
        perceptualRoughness,
        metallic,
        specularEnvironmentR0,
        specularEnvironmentR90,
        alphaRoughness,
        diffuseColor,
        specularColor
    );

    // Calculate the shading terms for the microfacet specular shading model
    vec3 F = specularReflection(pbrInputs);
    float G = geometricOcclusion(pbrInputs);
    float D = microfacetDistribution(pbrInputs);

    // Calculation of analytical lighting contribution
    vec3 diffuseContrib = (1.0 - F) * diffuse(pbrInputs);
    vec3 specContrib = F * G * D / (4.0 * NdotL * NdotV);
    // Obtain final intensity as reflectance (BRDF) scaled by the energy of the light (cosine law)
    vec3 color = NdotL * u_LightColor * (diffuseContrib + specContrib);

    // Calculate lighting contribution from image based lighting source (IBL)
    #ifdef USE_IBL
    color += getIBLContribution(pbrInputs, n, reflection);
    #endif

    // Apply optional PBR terms for additional (optional) shading
    #ifdef HAS_OCCLUSIONMAP
    float ao = texture(u_OcclusionSampler, vUv).r;
    color = mix(color, color * ao, u_OcclusionStrength);
    #endif

    #ifdef HAS_EMISSIVEMAP
    vec3 emissive = SRGBtoLINEAR(texture(u_EmissiveSampler, vUv)).rgb * u_EmissiveFactor;
    color += emissive;
    #endif

    // This section uses mix to override final color for reference app visualization
    // of various parameters in the lighting equation.
    color = mix(color, F, u_ScaleFGDSpec.x);
    color = mix(color, vec3(G), u_ScaleFGDSpec.y);
    color = mix(color, vec3(D), u_ScaleFGDSpec.z);
    color = mix(color, specContrib, u_ScaleFGDSpec.w);

    color = mix(color, diffuseContrib, u_ScaleDiffBaseMR.x);
    color = mix(color, baseColor.rgb, u_ScaleDiffBaseMR.y);
    color = mix(color, vec3(metallic), u_ScaleDiffBaseMR.z);
    color = mix(color, vec3(perceptualRoughness), u_ScaleDiffBaseMR.w);

    FragColor = vec4(pow(color,vec3(1.0/2.2)), baseColor.a);
}

`;

    var PBRBaseShader = {vertex, fragment};

    class GLTFParser {
        constructor(gl, json, options = {}) {
            this.gl = gl;
            this.json = json || {};
            // Cache
            this.cache = new GLTFRegistry();
            this.path = options.path || '';
            this.useIBL = options.useIBL == undefined ? true : options.useIBL;
            this.envDiffuseCubeMapSrc = options.envDiffuseCubeMapSrc;
            this.envSpecularCubeMapSrc = options.envSpecularCubeMapSrc;
            this.glExtension = {
                hasSRGBExt: gl.getExtension('EXT_SRGB'),
                hasLODExtension: gl.getExtension('EXT_shader_texture_lod'),
            };
        }
        parse(onLoad, onError) {
            let json = this.json;
            // Clear the loader cache
            this.cache.removeAll();
            // Mark the special nodes/meshes in json for efficient parse
            this.markDefs();
            // Load data info
            this.getMultiDependencies([
                'scene',
                'camera',
                'animations'
            ]).then((dependencies) => {
                let scenes = dependencies.scenes || [];
                let scene = scenes[json.scene || 0];
                let animations = dependencies.animations || [];
                let cameras = dependencies.cameras || [];
                onLoad(scene, scenes, cameras, animations, json);// Push callback needed args
            }).catch(onError);
        }
        /**
    	 * Marks the special nodes/meshes in json for efficient parse.
    	 */
        markDefs() {
            let nodeDefs = this.json.nodes || [];
            let skinDefs = this.json.skins || [];
            let meshDefs = this.json.meshes || [];
            // Mark bones.
            for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
                let joints = skinDefs[skinIndex].joints;
                for (let i = 0, il = joints.length; i < il; i++) {
                    nodeDefs[joints[i]].isBone = true;
                }
            }
            for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
                let nodeDef = nodeDefs[nodeIndex];
                if (nodeDef.mesh !== undefined) {
                    // Mark SkinnedMesh if node has skin.
                    if (nodeDef.skin !== undefined) {
                        meshDefs[nodeDef.mesh].isSkinnedMesh = true;
                    }
                }
            }
        }
        /**
    	 * Requests all multiple dependencies of the specified types asynchronously
    	 * @param {Array<string>} types
    	 */
        getMultiDependencies(types) {
            let results = {};
            let pendings = [];
            for (let i = 0, il = types.length; i < il; i++) {
                let type = types[i];
                let value = this.getDependencies(type);
                value = value.then(function (key, value) {
                    results[key] = value;
                }.bind(this, type + (type === 'mesh' ? 'es' : 's')));
                pendings.push(value);
            }
            return Promise.all(pendings).then(() => {
                return results;
            });
        }
        /**
    	 * Requests all dependencies of the specified type asynchronously
    	 * @param {string} type
    	 */
        getDependencies(type) {
            let dependencies = this.cache.get(type);
            if (!dependencies) {
                let parser = this;
                let defs = this.json[type + (type === 'mesh' ? 'es' : 's')] || [];
                dependencies = Promise.all(defs.map(function (def, index) {
                    return parser.getDependency(type, index);
                }));
                this.cache.add(type, dependencies);
            }
            return dependencies;
        }
        /**
    	 * Requests the specified dependency asynchronously
    	 * @param {string} type
    	 * @param {number} index
    	 */
        getDependency(type, index) {
            let cacheKey = type + ':' + index;
            let dependency = this.cache.get(cacheKey);
            if (!dependency) {
                switch (type) {
                    case 'scene':
                        dependency = this.loadScene(index);
                        break;
                    case 'node':
                        dependency = this.loadNode(index);
                        break;
                    case 'mesh':
                        dependency = this.loadMesh(index);
                        break;
                    case 'accessor':
                        dependency = this.loadAccessor(index);
                        break;
                    case 'bufferView':
                        dependency = this.loadBufferView(index);
                        break;
                    case 'buffer':
                        dependency = this.loadBuffer(index);
                        break;
                    case 'material':
                        dependency = this.loadMaterial(index);
                        break;
                    case 'texture':
                        dependency = this.loadTexture(index);
                        break;
                    case 'skin':
                        dependency = this.loadSkin(index);
                        break;
                    case 'animation':
                        dependency = this.loadAnimation(index);
                        break;
                    case 'camera':
                        dependency = this.loadCamera(index);
                        break;
                    default:
                        throw new Error('Unknown type: ' + type);
                }
            }
            return dependency;
        }
        /**
         * Scene node hierachy builder
    	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
    	 * @param {number} sceneIndex
    	 */
        loadScene(sceneIndex) {
            let json = this.json;
            let sceneDef = this.json.scenes[sceneIndex];
            return this.getMultiDependencies([
                'node',
                'skin'
            ]).then(function (dependencies) {
                console.log('dependencies: ', dependencies);
                let scene = new Transform();
                if (sceneDef.name !== undefined) scene.name = sceneDef.name;
                let nodeIds = sceneDef.nodes || [];
                for (let i = 0, il = nodeIds.length; i < il; i++) {
                    buildNodeHierachy(nodeIds[i], scene, json, dependencies.nodes, dependencies.skins, dependencies.animations);
                }
                return scene;
            });
            function buildNodeHierachy(nodeId, parentObject, json, allNodes, skins, animations) {
                let node = allNodes[nodeId];
                let nodeDef = json.nodes[nodeId];
                // build node hierachy
                if (nodeDef.skin !== undefined) {
                    let meshes = node.children.length ? node.children : [node];
                    for (let i = 0, il = meshes.length; i < il; i++) {
                        let mesh = meshes[i];
                        let skinEntry = skins[nodeDef.skin];
                        let bones = [];
                        let boneInverses = [];
                        for (let j = 0, jl = skinEntry.joints.length; j < jl; j++) {
                            let jointId = skinEntry.joints[j];
                            let jointNode = allNodes[jointId];
                            if (jointNode) {
                                bones.push(jointNode);
                                let mat = new Mat4();
                                if (skinEntry.inverseBindMatrices !== undefined) {
                                    mat.fromArray(skinEntry.inverseBindMatrices.data, j * 16);
                                }
                                boneInverses.push(mat);
                            } else {
                                console.warn('Could not found jointNode', jointId);
                            }
                        }
                        mesh.init({
                            bones,
                            boneInverses
                        });
                    }
                }
                parentObject.addChild(node);
                if (nodeDef.children) {
                    let children = nodeDef.children;
                    for (let i = 0, il = children.length; i < il; i++) {
                        let child = children[i];
                        buildNodeHierachy(child, node, json, allNodes, skins, animations);
                    }
                }
            }
        }
        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
    	 * @param {number} nodeIndex
    	 */
        loadNode(nodeIndex) {
            let json = this.json;
            let nodeDef = json.nodes[nodeIndex];
            return this.getMultiDependencies([
                'mesh',
                'skin',
                'camera',
            ]).then(function (dependencies) {
                let node;
                if (nodeDef.isBone === true) {
                    node = new Transform();
                    node.isBone = true; // Mark this is a bone node
                } else if (nodeDef.mesh !== undefined) {
                    let mesh = dependencies.meshes[nodeDef.mesh];
                    node = mesh;
                } else if (nodeDef.camera !== undefined) {
                    node = dependencies.cameras[nodeDef.camera];
                } else {
                    node = new Transform();
                }
                if (nodeDef.name !== undefined) {
                    node.name = nodeDef.name;
                }
                if (nodeDef.matrix !== undefined) {
                    let matrix = new Mat4();
                    matrix.fromArray(nodeDef.matrix);
                    node.applyMatrix(matrix);
                } else {
                    if (nodeDef.translation !== undefined) {
                        node.position.fromArray(nodeDef.translation);
                    }
                    if (nodeDef.rotation !== undefined) {
                        node.quaternion.fromArray(nodeDef.rotation);
                    }
                    if (nodeDef.scale !== undefined) {
                        node.scale.fromArray(nodeDef.scale);
                    }
                }
                return node;
            });
        };
        /**
        * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
        * @param {number} meshIndex
        */
        loadMesh(meshIndex) {
            let parser = this;
            let json = this.json;
            let meshDef = json.meshes[meshIndex];
            return this.getMultiDependencies([
                'accessor',
                'material'
            ]).then(function (dependencies) {
                let primitives = meshDef.primitives;
                let originalMaterials = [];
                // Check every material
                for (let i = 0, il = primitives.length; i < il; i++) {
                    originalMaterials[i] = primitives[i].material === undefined
                        ? {} // Use default material
                        : dependencies.materials[primitives[i].material];
                }
                return parser.loadGeometries(primitives).then(function (geometries) {
                    let meshes = [];
                    for (let i = 0, il = geometries.length; i < il; i++) {
                        let geometry = geometries[i];
                        let primitive = primitives[i];
                        // Create Mesh
                        let mesh;
                        let materialParams = originalMaterials[i];
                        let fragDefines = materialParams.glTFLoaderDefines || {};
                        let vexDefines = geometry.glTFLoaderDefines || {};
                        let defines = Object.assign({}, fragDefines, vexDefines);
                        let shaderDefines = '#version 300 es\n' + definesToString(defines);
                        if (parser.useIBL) {
                            shaderDefines += '#define USE_IBL 1\n';
                        }
                        if (parser.glExtension.hasSRGBExt) {
                            shaderDefines += '#define MANUAL_SRGB 1\n';
                        }
                        if (parser.glExtension.hasLODExtension) {
                            shaderDefines += '#define USE_TEX_LOD 1\n';
                        }
                        if (meshDef.isSkinnedMesh) {
                            shaderDefines += '#define USE_SKINNING 1\n';
                        }
                        let program = new Program(parser.gl, {
                            vertex: shaderDefines + PBRBaseShader.vertex,
                            fragment: shaderDefines + PBRBaseShader.fragment,
                            uniforms: materialParams.uniforms,
                            ...materialParams.options
                        });
                        if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
                            primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
                            primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
                            primitive.mode === undefined) {
                            mesh = meshDef.isSkinnedMesh === true
                                ? new Skin(parser.gl, { geometry, program })
                                : new Mesh(parser.gl, { geometry, program });
                            if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
                                mesh.mode = parser.gl.TRIANGLE_STRIP;
                            } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
                                mesh.mode = parser.gl.TRIANGLE_FAN;
                            }
                        } else {
                            throw new Error('Primitive mode unsupported: ' + primitive.mode);
                        }
                        mesh.name = meshDef.name || ('mesh_' + meshIndex);
                        if (geometries.length > 1) mesh.name += '_' + i;
                        meshes.push(mesh);
                    }
                    if (meshes.length === 1) {
                        return meshes[0];
                    }
                    let group = new Transform();
                    for (let i = 0, il = meshes.length; i < il; i++) {
                        group.add(meshes[i]);
                    }
                    return group;
                });
            });
        };
        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
    	 * @param {number} accessorIndex
    	 */
        loadAccessor(accessorIndex) {
            let json = this.json;
            let accessorDef = json.accessors[accessorIndex];
            if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {
                // Ignore empty accessors, which may be used to declare runtime
                return null;
            }
            let pendingBufferViews = [];
            if (accessorDef.bufferView !== undefined) {
                pendingBufferViews.push(this.getDependency('bufferView', accessorDef.bufferView));
            } else {
                pendingBufferViews.push(null);
            }
            if (accessorDef.sparse !== undefined) {
                pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.indices.bufferView));
                pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.values.bufferView));
            }
            return Promise.all(pendingBufferViews).then(function (bufferViews) {
                let bufferView = bufferViews[0];
                let itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
                let TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
                // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
                let elementBytes = TypedArray.BYTES_PER_ELEMENT;
                let itemBytes = elementBytes * itemSize;
                let byteOffset = accessorDef.byteOffset || 0;
                let byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[accessorDef.bufferView].byteStride : undefined;
                let normalized = accessorDef.normalized === true;
                let array, bufferAttribute;
                // The buffer is not interleaved if the stride is the item size in bytes.
                if (byteStride && byteStride !== itemBytes) {
                    // Todo: InterleavedBuffer
                    console.err("InterleavedBuffer no supported yet");
                } else {
                    if (bufferView === null) {
                        array = new TypedArray(accessorDef.count * itemSize);
                    } else {
                        array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
                    }
                    bufferAttribute = new BufferAttribute(array, itemSize, normalized);
                }
                // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
                if (accessorDef.sparse !== undefined) {
                    let itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
                    let TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
                    let byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
                    let byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
                    let sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
                    let sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
                    if (bufferView !== null) {
                        // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
                        bufferAttribute.setArray(bufferAttribute.array.slice());
                    }
                    for (let i = 0, il = sparseIndices.length; i < il; i++) {
                        let index = sparseIndices[i];
                        bufferAttribute.setX(index, sparseValues[i * itemSize]);
                        if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
                        if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
                        if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
                        if (itemSize >= 5) throw new Error('Unsupported itemSize in sparse BufferAttribute');
                    }
                }
                return bufferAttribute;
            });
        }
        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
    	 * @param {number} bufferViewIndex
    	 * @return {Promise<ArrayBuffer>}
         * Dependencies: buffer
    	 */
        loadBufferView(bufferViewIndex) {
            let bufferViewDef = this.json.bufferViews[bufferViewIndex];
            return this.getDependency('buffer', bufferViewDef.buffer).then(function (buffer) {
                let byteLength = bufferViewDef.byteLength || 0;
                let byteOffset = bufferViewDef.byteOffset || 0;
                return buffer.slice(byteOffset, byteOffset + byteLength);
            });
        }

        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
    	 * @param {number} bufferIndex
    	 * @return {Promise<ArrayBuffer>}
    	 */
        loadBuffer(bufferIndex) {
            let bufferDef = this.json.buffers[bufferIndex];
            if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
                throw new Error(bufferDef.type + ' buffer type is not supported yet');
            }
            let path = this.path;
            return fetch(resolveURL(bufferDef.uri, path)).then(response => {
                return response.arrayBuffer();
            })
        }

        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
    	 * @param {number} materialIndex
         * Dependencies: texture
    	 */
        loadMaterial(materialIndex) {
            let parser = this;
            let json = this.json;
            let materialDef = json.materials[materialIndex];
            let materialParams = {};
            let pending = [];
            let defines = {};
            let programeOpt = {};

            // Specification:
            // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material
            let metallicRoughness = materialDef.pbrMetallicRoughness || {};
            let { baseColorFactor, baseColorTexture } = metallicRoughness;
            // Base Color
            materialParams.u_BaseColorFactor = {
                value: Array.isArray(baseColorFactor) ? baseColorFactor : new Vec4(1.0, 1.0, 1.0, 1.0)
            };
            if (baseColorTexture !== undefined) {
                pending.push(parser.assignTexture(materialParams, 'u_BaseColorSampler', metallicRoughness.baseColorTexture.index));
                defines.HAS_BASECOLORMAP = 1;
            }
            // Metalness-Roughness
            let metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
            let roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;
            materialParams.u_MetallicRoughnessValues = {
                value: [metalness, roughness]
            };
            if (metallicRoughness.metallicRoughnessTexture !== undefined) {
                let textureIndex = metallicRoughness.metallicRoughnessTexture.index;
                pending.push(parser.assignTexture(materialParams, 'u_MetallicRoughnessSampler', textureIndex));
                defines.HAS_METALROUGHNESSMAP = 1;
            }
            // Normals
            if (materialDef.normalTexture !== undefined) {
                pending.push(parser.assignTexture(materialParams, 'u_NormalSampler', materialDef.normalTexture.index));
                materialParams.u_NormalScale = {
                    value: materialDef.normalTexture.scale || 1.0
                };
                defines.HAS_NORMALMAP = 1;
            }
            // BRDFLUT
            pending.push(parser.loadTextureFromSrc(materialParams, 'tLUT', '/examples/assets/images/brdfLUT.png', false));
            if (parser.envDiffuseCubeMapSrc) pending.push(parser.loadCubeMapFromSrc(materialParams, 'tEnvDiffuse', parser.envDiffuseCubeMapSrc, false));
            if (parser.envSpecularCubeMapSrc) pending.push(parser.loadCubeMapFromSrc(materialParams, 'tEnvSpecular', parser.envSpecularCubeMapSrc, false));
            // This is a multiplier to the amount of specular. Especially useful if you don't have an HDR map.
            materialParams.uEnvSpecular = { value: 2 };

            // Emissive
            if (materialDef.emissiveTexture !== undefined) {
                if (materialDef.emissiveFactor !== undefined) {
                    materialParams.u_EmissiveFactor = {
                        value: new Color().fromArray(materialDef.emissiveFactor)
                    };
                }
                pending.push(parser.assignTexture(materialParams, 'u_EmissiveSampler', materialDef.emissiveTexture.index));
                defines.HAS_EMISSIVEMAP = 1;
            }

            // AO
            if (materialDef.occlusionTexture !== undefined) {
                pending.push(parser.assignTexture(materialParams, 'u_OcclusionSampler', materialDef.occlusionTexture.index));
                materialParams.u_OcclusionStrength = {
                    value: materialDef.occlusionTexture.strength || 1.0
                };
            }

            // Alpha
            let alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
            if (alphaMode === ALPHA_MODES.BLEND) {
                programeOpt.transparent = true;
            } else {
                programeOpt.transparent = false;
            }

            return Promise.all(pending).then(function () {
                let material = {
                    uniforms: materialParams,
                    glTFLoaderDefines: defines,
                    options: programeOpt
                };
                return material;
            });
        };

        /**
    	 * Asynchronously assigns a texture to the given material parameters.
    	 * @param {Object} materialParams
    	 * @param {string} textureName
    	 * @param {number} textureIndex
    	 * @return {Promise}
    	 */
        assignTexture(materialParams, textureName, textureIndex) {
            return this.getDependency('texture', textureIndex).then(function (texture) {
                materialParams[textureName] = { value: texture };
            });
        }

        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
    	 * @param {number} textureIndex
    	 */
        loadTexture(textureIndex) {
            let parser = this;
            let json = this.json;
            let URL = window.URL || window.webkitURL;
            let textureDef = json.textures[textureIndex];
            let source;
            source = json.images[textureDef.source];
            let sourceURI = source.uri;
            if (source.bufferView !== undefined) {
                //Todo: Load binary image data from bufferView, if provided.
                sourceURI = parser.getDependency('bufferView', source.bufferView).then(function (bufferView) {
                    isObjectURL = true;
                    var blob = new Blob([bufferView], { type: source.mimeType });
                    sourceURI = URL.createObjectURL(blob);
                    return sourceURI;
                });
            }
            return new Promise(function (resolve) {
                // Load Texture resource.
                let src = resolveURL(sourceURI, parser.path);
                const texture = new Texture(parser.gl, {
                    flipY: false
                });
                const image = new Image();
                image.onload = () => {
                    texture.image = image;
                    return resolve(texture);
                };
                image.src = src;
            }).then(function (texture) {
                // Clean up resources and configure Texture.
                if (textureDef.name !== undefined) texture.name = textureDef.name;
                // Ignore unknown mime types, like DDS files.
                if (source.mimeType) {
                    switch (source.mimeType) {
                        case 'image/png':
                            texture.format = parser.gl.RGBA;
                            break;
                        case 'image/jpeg':
                            texture.format = parser.gl.RGB;
                            break;
                        default:
                            break;
                    }
                }
                let samplers = json.samplers || {};
                let sampler = samplers[textureDef.sampler] || {};
                texture.magFilter = sampler.magFilter || parser.gl.LINEAR;
                texture.minFilter = sampler.minFilter || parser.gl.LINEAR_MIPMAP_LINEAR;
                //默认为 gl.REPEAT
                texture.wrapS = sampler.wrapS || parser.gl.REPEAT;
                texture.wrapT = sampler.wrapT || parser.gl.REPEAT;
                return texture;
            });
        }

        loadTextureFromSrc(materialParams, key, src, generateMipmaps = true) {
            let parser = this;
            return new Promise(function (resolve) {
                const texture = new Texture(parser.gl, {
                    flipY: false,
                    generateMipmaps
                });
                const image = new Image();
                image.onload = () => {
                    texture.image = image;
                    materialParams[key] = { value: texture };
                    resolve(texture);
                };
                image.src = src;
            })
        }

        loadCubeMapFromSrc(materialParams, key, src) {
            let parser = this;
            let path = src;
            let paths = [
                path + "px.jpg",
                path + "nx.jpg",
                path + "py.jpg",
                path + "ny.jpg",
                path + "pz.jpg",
                path + "nz.jpg"
            ];
            let pendings = [];
            for (let i = 0; i < paths.length; i++) {
                let pending = new Promise(function (resolve) {
                    let image = new Image();
                    image.onload = () => resolve(image);
                    image.src = paths[i];
                });
                pendings.push(pending);
            }
            return Promise.all(pendings).then(function (obj) {
                const texture = new Texture(parser.gl, {
                    target: parser.gl.TEXTURE_CUBE_MAP,
                    image: obj[0],
                    images: obj,
                    flipY: false,
                    generateMipmaps: false
                });
                materialParams[key] = { value: texture };
            })
        }

        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
    	 * @param {Array<Object>} primitives
    	 */
        loadGeometries(primitives) {
            let parser = this;
            return this.getDependencies('accessor').then(function (accessors) {
                let pending = [];
                for (let i = 0, il = primitives.length; i < il; i++) {
                    let primitive = primitives[i];
                    let geometry = new Geometry(parser.gl);
                    parser.addPrimitiveAttributes(geometry, primitive, accessors);
                    var geometryPromise = Promise.resolve(geometry);
                    pending.push(geometryPromise);
                }
                return Promise.all(pending).then(function (geometries) {
                    return geometries;
                });
            });
        };

        addPrimitiveAttributes(geometry, primitiveDef, accessors) {
            let attributes = primitiveDef.attributes;
            let defines = {};
            for (let gltfAttributeName in attributes) {
                // Record the defines
                switch (gltfAttributeName) {
                    case "NORMAL":
                        defines.HAS_NORMALS = 1;
                        break;
                    case "TANGENT":
                        defines.HAS_TANGENTS = 1;
                        break;
                    case "TEXCOORD_0":
                        defines.HAS_UV = 1;
                        break;
                }
                geometry.glTFLoaderDefines = defines;
                let lglAttributeName = ATTRIBUTES[gltfAttributeName];
                let bufferAttribute = accessors[attributes[gltfAttributeName]];
                if (!lglAttributeName) continue;
                if (lglAttributeName in geometry.attributes) continue;
                geometry.addAttribute(lglAttributeName, bufferAttribute);
            }
            if (primitiveDef.indices !== undefined && !geometry.index) {
                geometry.setIndex(accessors[primitiveDef.indices]);
            }
        }
        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
    	 * @param {number} cameraIndex
    	 */
        loadCamera(cameraIndex) {
            let camera;
            let cameraDef = this.json.cameras[cameraIndex];
            let params = cameraDef[cameraDef.type];
            if (!params) {
                console.warn('GLTFLoader: Missing camera parameters.');
                return;
            }
            if (cameraDef.type === 'perspective') {
                camera = new Camera({
                    fov: radToDeg(params.yfov),
                    aspect: params.aspectRatio || 1,
                    near: params.znear || 1,
                    far: params.zfar || 2e6
                });
            } else if (cameraDef.type === 'orthographic') {
                camera = new Camera({
                    left: params.xmag / - 2,
                    right: params.xmag / 2,
                    top: params.ymag / 2,
                    bottom: params.ymag / - 2,
                    near: params.znear,
                    far: params.zfar
                });
            }
            if (cameraDef.name !== undefined) camera.name = cameraDef.name;
            return Promise.resolve(camera);
        };

        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
    	 * @param {number} skinIndex
    	 */
        loadSkin(skinIndex) {
            let skinDef = this.json.skins[skinIndex];
            let skinEntry = { joints: skinDef.joints };
            if (skinDef.inverseBindMatrices === undefined) {
                return Promise.resolve(skinEntry);
            }
            return this.getDependency('accessor', skinDef.inverseBindMatrices).then(function (accessor) {
                skinEntry.inverseBindMatrices = accessor;
                return skinEntry;
            });
        };

        /**
    	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
    	 * @param {number} animationIndex
    	 */
        loadAnimation(animationIndex) {
            let json = this.json;
            let animationDef = json.animations[animationIndex];
            return this.getMultiDependencies([
                'accessor',
                'node'
            ]).then(function (dependencies) {
                let tracks = [];
                for (let i = 0, il = animationDef.channels.length; i < il; i++) {
                    let channel = animationDef.channels[i];
                    let sampler = animationDef.samplers[channel.sampler];
                    if (sampler) {
                        let target = channel.target;
                        let name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
                        let input = animationDef.parameters !== undefined ? animationDef.parameters[sampler.input] : sampler.input;
                        let output = animationDef.parameters !== undefined ? animationDef.parameters[sampler.output] : sampler.output;
                        let inputAccessor = dependencies.accessors[input];
                        let outputAccessor = dependencies.accessors[output].data;
                        let node = dependencies.nodes[name];
                        if (node) {// 先只处理骨骼动画
                            let keyCount = inputAccessor.count;
                            for (let i = 0; i < keyCount; i++) {
                                let keyTime = inputAccessor.data[i];
                                if (!tracks[keyTime]) {
                                    tracks[keyTime] = {
                                        position: [],
                                        quaternion: [],
                                        scale: []
                                    };
                                }
                                switch (target.path) {
                                    case "weights":
                                        console.error("Not support weight now.");
                                        break;
                                    case "rotation":
                                        tracks[keyTime].quaternion.push(outputAccessor[i * 4], outputAccessor[i * 4 + 1], outputAccessor[i * 4 + 2], outputAccessor[i * 4 + 3]);
                                        tracks[keyTime].position.push(0, 0, 0);
                                        tracks[keyTime].scale.push(0, 0, 0);
                                        break;
                                    case "translation":
                                        tracks[keyTime].position.push(outputAccessor[i * 3], outputAccessor[i * 3 + 1], outputAccessor[i * 3 + 2]);
                                        tracks[keyTime].quaternion.push(0, 0, 0, 0);
                                        tracks[keyTime].scale.push(0, 0, 0);
                                        break;
                                    case "scale":
                                        tracks[keyTime].scale.push(outputAccessor[i * 3], outputAccessor[i * 3 + 1], outputAccessor[i * 3 + 2]);
                                        tracks[keyTime].quaternion.push(0, 0, 0, 0);
                                        tracks[keyTime].position.push(0, 0, 0);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
                tracks = Object.values(tracks);
                return tracks;
            });
        };
    }

    /**
     * Loader of glTF format
     */
    class GLTFLoader {
        constructor(gl) {
            this.gl = gl;
        }
        async load(url, options = {}, onLoad, onError) {
            let resourcesPath = extractUrlBase(url);        const data = await (await fetch(url)).arrayBuffer();
            this.parse(data, resourcesPath, options, function (gltf) {
                onLoad(gltf);
            }, onError);
        }
        parse(data, path, options, onLoad, onError) {
            let content;
            if (typeof data === 'string') {
                content = data;
            } else {
                content = decodeText(new Uint8Array(data));
            }
            let json = JSON.parse(content);
            console.log("JSON.parse result: ", json);
            if (json.asset === undefined || json.asset.version[0] < 2) {
                if (onError) onError(new Error('Unsupported glTF versions < 2.0.'));
                return;
            }
            // Todo:Extension
            if (json.extensionsUsed) {
                console.error("No support extension now");
            }
            let parser = new GLTFParser(this.gl, json, { path, ...options });
            parser.parse((scene, scenes, cameras, animations, json) => {
                let glTF = {
                    scene,
                    scenes,
                    cameras,
                    animations,
                    parser,
                    json
                };
                onLoad(glTF);// CallBack
            }, onError);
        }
    }

    exports.GLTFLoader = GLTFLoader;

    return exports;

}({}));
