import * as Vec2Func from './functions/Vec2Func.js';

/** 
 * @class Vec2
 * @description Two-Dimensional Vector Class
 * @param {Number} [x=0] The element of Vec2.x
 * @param {Number} [y=x] The element of Vec2.y
 * @example
 * // create a new Two-Dimensional Vector
 * new Vec2(0, 0);
 */
export class Vec2 extends Array {
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
        if (x.length) return this.copy(x);
        Vec2Func.set(this, x, y);
        return this;
    }
    /**
     * @function
     * @description Copy the values from one vec2 to another
     * @param {Array} v The value to copy.
     * @returns {Vec2} 
     */
    copy(v) {
        Vec2Func.copy(this, v);
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
        if (vb) Vec2Func.add(this, va, vb);
        else Vec2Func.add(this, this, va);
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
        if (vb) Vec2Func.subtract(this, va, vb);
        else Vec2Func.subtract(this, this, va);
        return this;
    }
    /**
    * @function
    * @description Multiplies a vec2/number
    * @param {Array/Number} m
    * @returns {Vec2} 
    */
    multiply(m) {
        if (m.length) Vec2Func.multiply(this, this, m);
        else Vec2Func.scale(this, this, m);
        return this;
    }
    /**
    * @function
    * @description Divides a vec2/number
    * @param {Array/Number} m
    * @returns {Vec2} 
    */
    divide(m) {
        if (m.length) Vec2Func.divide(this, this, m);
        else Vec2Func.scale(this, this, 1 / m);
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
        Vec2Func.scale(this, this, v);
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
        if (v) return Vec2Func.distance(this, v);
        else return Vec2Func.length(this);
    }
    /**
     * @function
     * @description  Calculates the squared euclidian distance between two vec2's.
     * i.e.,length(this-v)²
     * @param {Vec2} [v=[0,0]] the operand vec2
     * @returns {Number} squared distance between this vec2 and v
     */
    squaredDistance(v) {
        if (v) return Vec2Func.squaredDistance(this, v);
        else return Vec2Func.squaredLength(this);
    }
    /**
     * @function
     * @description Calculates the length of a vec2.
     * i.e.,√(x²+y²)
     * @returns {Number} length of this vec2
     */
    len() {
        return Vec2Func.length(this);
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
        Vec2Func.negate(this, v);
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
        Vec2Func.inverse(this, v);
        return this;
    }
    /**
     * @function
     * @description Normalize a vec2.
     * i.e.,v/|v| => (x/√(x²+y²),y/√(x²+y²))
     * @returns {Vec2} 
     */
    normalize() {
        Vec2Func.normalize(this, this);
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
        return Vec2Func.dot(this, v);
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
        return Vec2Func.cross(va, vb);
    }
    /**
     * @function
     * @description Performs a linear interpolation between two vec2's
     * i.e.,[x+a×(v[0]-x),y+a×(v[1]-x)];
    * @param {vec3} a the first operand
     * @param {vec3} b the second operand
     * @param {Number} t interpolation amount between the two inputs
     * @returns {Vec2} 
     */
    lerp(a, b, t) {
        Vec2Func.lerp(this, a, b, t);
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
        Vec2Func.transformMat3(this, this, mat3);
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
        Vec2Func.transformMat4(this, this, mat4);
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
        return Vec2Func.exactEquals(this, v);
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
