import * as QuatFunc from './functions/QuatFunc.js';
/** 
 * @class Quat
 * @description Four-Dimensional Vector Class
 */
export class Quat extends Float32Array {
    constructor(array = [0, 0, 0, 1]) {
        super(array);
        this.onChange = () => { };
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
        QuatFunc.identity(this);
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
        QuatFunc.set(this, x, y, z, w);
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
        QuatFunc.rotateX(this, this, a);
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
        QuatFunc.rotateY(this, this, a);
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
        QuatFunc.rotateZ(this, this, a);
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
        QuatFunc.invert(this, q);
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
        QuatFunc.conjugate(this, q);
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
        QuatFunc.copy(this, q);
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
        QuatFunc.normalize(this, q);
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
            QuatFunc.multiply(this, qA, qB);
        } else {
            QuatFunc.multiply(this, this, qA);
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
        return QuatFunc.dot(this, v);
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
        QuatFunc.fromMat3(this, matrix3);
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
        QuatFunc.fromEuler(this, euler, euler.order);
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
        QuatFunc.slerp(this, this, b, c, d, t);
        return this;
    }
    /**
     * @function
     * @description generate Quat from Array
     * @param {Array} a
     * @param {Number} b index offset of a
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
