import * as Vec4Func from './functions/Vec4Func.js';
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
export class Vec4 extends Array {
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
        Vec4Func.set(this, x, y, z, w);
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
