import * as EulerFunc from './functions/EulerFunc.js';
import { Mat4 } from './Mat4.js';

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
export class Euler extends Array {
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
        if (x.length) return this.copy(x);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this.onChange();
        return this;
    }
     /**
     * @function
     * @description copy a Euler from Array
     * @param {Array} v
     * @returns {Euler} 
     */
    copy(v) {
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
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
        EulerFunc.fromRotationMatrix(this, m, order);
        return this;
    }

    fromQuaternion(q, order = this.order) {
        tmpMat4.fromQuaternion(q);
        return this.fromRotationMatrix(tmpMat4, order);
    }
}