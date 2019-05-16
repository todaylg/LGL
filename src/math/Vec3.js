import * as Vec3Func from './functions/Vec3Func.js';

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
export class Vec3 extends Array {
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
        Vec3Func.set(this, x, y, z);
        return this;
    }
    /**
     * @function
     * @description Copy the values from one vec3 to another
     * @param {Array} v The value to copy.
     * @returns {Vec3}
     */
    copy(v) {
        Vec3Func.copy(this, v);
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
        if (vb) Vec3Func.add(this, va, vb);
        else Vec3Func.add(this, this, va);
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
        if (vb) Vec3Func.subtract(this, va, vb);
        else Vec3Func.subtract(this, this, va);
        return this;
    }
    /**
    * @function
    * @description Multiplies a vec3/number
    * @param {Array/Number} m
    * @returns {Vec3}
    */
    multiply(v) {
        if (v.length) Vec3Func.multiply(this, this, v);
        else Vec3Func.scale(this, this, v);
        return this;
    }
    /**
    * @function
    * @description Divides a vec3/number
    * @param {Array/Number} m
    * @returns {Vec3}
    */
    divide(v) {
        if (v.length) Vec3Func.divide(this, this, v);
        else Vec3Func.scale(this, this, 1 / v);
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
        Vec3Func.scale(this, this, v);
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
        if (v) return Vec3Func.distance(this, v);
        else return Vec3Func.length(this);
    }
    /**
     * @function
     * @description  Calculates the squared euclidian distance between two vec3's.
     * i.e.,length(this-v)²
     * @param {vec3} [v=[0,0,0]] the operand vec3
     * @returns {Number} squared distance between this vec3 and v
     */
    squaredDistance(v) {
        if (v) return Vec3Func.squaredDistance(this, v);
        else return Vec3Func.squaredLength(this);
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
        Vec3Func.negate(this, v);
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
        Vec3Func.inverse(this, v);
        return this;
    }
    /**
     * @function
     * @description Normalize a vec3.
     * i.e.,v/|v| => (x/√(x²+y²+z²),y/√(x²+y²+z²),z/√(x²+y²+z²))
     * @returns {Vec3}
     */
    normalize() {
        Vec3Func.normalize(this, this);
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
        return Vec3Func.dot(this, v);
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
        Vec3Func.cross(this, va, vb);
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
        Vec3Func.lerp(this, this, v, t);
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
        Vec3Func.hermite(this, this, v, b, c, d, t);
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
        Vec3Func.bezier(this, this, v, b, c, d, t);
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
        Vec3Func.transformMat4(this, this, mat4);
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
        Vec3Func.transformQuat(this, this, q);
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
        return Vec3Func.angle(this, v);
    }
    /**
     * @function
     * @description
     * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
     * @param {vec3} b The compare vector.
     * @returns {Boolean} True if the vectors are equal, false otherwise.
     */
    equals(v) {
        return Vec3Func.exactEquals(this, v);
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
