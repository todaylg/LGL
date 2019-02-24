import * as Mat3Func from './functions/Mat3Func.js';

/** 
 * @class Mat3
 * @description Three order matrix
 * @param {Array} [array=[1, 0, 0, 0, 1, 0, 0, 0, 1]] The element of matrix.
 * @example
 * // create a new Three-Dimensional Vector
 * new Mat3();
 */
export class Mat3 extends Float32Array {
    constructor(array = [1, 0, 0, 0, 1, 0, 0, 0, 1]) {
        super(array);
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
     * @returns {mat3} out
     */
    set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
        Mat3Func.set(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
        return this;
    }
    /**
     * @function
     * @description Transpose the values of a mat3
     * @returns {mat3} out
     */
    transpose() {
        Mat3Func.transpose(this, this);
        return this;
    }
    /**
     * @function
     * @description Inverts a mat3(逆矩阵)
     * @returns {mat3} out
     */
    inverse(m = this) {
        Mat3Func.invert(this, m);
        return this;
    }
    /**
     * @function
     * @description Translate a mat3 by the given vector
     * @param {vec2} v vector to translate by
     * @param {mat3} [m=this] the matrix to translate
     * @returns {mat3} out
     */
    translate(v, m = this) {
        Mat3Func.translate(this, m, v);
        return this;
    }
    /**
    * @function
    * @description Rotates a mat3 by the given angle
    * @param {Number} v the angle to rotate the matrix by
    * @param {mat3} [m=this] the matrix to rotate
    * @returns {mat3} out
    */
    rotate(v, m = this) {
        Mat3Func.rotate(this, m, v);
        return this;
    }
    /**
    * @function
    * @description Scales the mat3 by the dimensions in the given vec2
    * @param {vec2} v the vec2 to scale the matrix by
    * @param {mat3} [m=this] the matrix to scale
    * @returns {mat3} out
    */
    scale(v, m = this) {
        Mat3Func.scale(this, m, v);
        return this;
    }
    /**
     * @function
     * @description Multiplies two mat3's
     * @param {mat3} ma the first operand
     * @param {mat3} mb the second operand
     * @returns {mat3} out
     */
    multiply(ma, mb) {
        if (mb) {
            Mat3Func.multiply(this, ma, mb);
        } else {
            Mat3Func.multiply(this, this, ma);
        }
        return this;
    }
    /**
     * @function
     * @description Set a mat3 to the identity matrix(单位矩阵)
     * @returns {mat3} out
     */
    identity() {
        Mat3Func.identity(this);
        return this;
    }
    /**
    * @function
    * @description Copy the values from one mat3 to another
    * @param {mat3} m the source matrix
    * @returns {mat3} out
    */
    copy(m) {
        Mat3Func.copy(this, m);
        return this;
    }
    /**
     * @function
     * @description Copies the upper-left 3x3 values into the given mat3.
     * @param {mat3} m the source 4x4 matrix
     * @returns {mat3} out
     */
    fromMatrix4(m) {
        Mat3Func.fromMat4(this, m);
        return this;
    }
    /**
     * @function
     * @description Calculates a 3x3 matrix from the given quaternion
     * @param {mat3} q Quaternion to create matrix from
     * @returns {mat3} out
     */
    fromQuaternion(q) {
        Mat3Func.fromQuat(this, q);
        return this;
    }
    /**
    * @function
    * @description Set a mat3 from the given 3 vec3
    * @param {vec3} vec3a
    * @param {vec3} vec3b
    * @param {vec3} vec3c
    * @returns {mat3} out
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
    * @ret
    */
    getNormalMatrix(m) {
        Mat3Func.normalFromMat4(this, m);
        return this;
    }
}
