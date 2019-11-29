import * as Mat4Func from './functions/Mat4Func.js';
/** 
 * @class Mat4
 * @description Four order matrix(column-major order)
 * @param {Number} [m00=1] The 0 column 0 row element of matrix
 * @param {Number} [m01=0] The 0 column 1 row element of matrix
 * @param {Number} [m02=0] The 0 column 2 row element of matrix
 * @param {Number} [m03=0] The 0 column 3 row element of matrix
 * @param {Number} [m10=0] The 1 column 0 row element of matrix
 * @param {Number} [m11=1] The 1 column 1 row element of matrix
 * @param {Number} [m12=0] The 1 column 2 row element of matrix
 * @param {Number} [m13=0] The 1 column 3 row element of matrix
 * @param {Number} [m20=0] The 2 column 0 row element of matrix
 * @param {Number} [m21=0] The 2 column 1 row element of matrix
 * @param {Number} [m22=1] The 2 column 2 row element of matrix
 * @param {Number} [m23=0] The 2 column 3 row element of matrix
 * @example
 * // create a new Three-Dimensional Vector
 * new Mat4();
 */
export class Mat4 extends Array {
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
        Mat4Func.set(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
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
        Mat4Func.translate(this, m, v);
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
        Mat4Func.rotateX(this, m, v);
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
        Mat4Func.rotateY(this, m, v);
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
        Mat4Func.rotateZ(this, m, v);
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
        Mat4Func.scale(this, m, typeof v === "number" ? [v, v, v] : v);
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
            Mat4Func.multiply(this, ma, mb);
        } else {
            Mat4Func.multiply(this, this, ma);
        }
        return this;
    }
    /**
     * @function
     * @description Set a mat4 to the identity matrix(单位矩阵)
     * @returns {Mat4} 
     */
    identity() {
        Mat4Func.identity(this);
        return this;
    }
    /**
     * @function
     * @description Copy the values from one mat4 to another
     * @param {Mat4} m the source matrix
     * @returns {Mat4} 
     */
    copy(m) {
        Mat4Func.copy(this, m);
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
        Mat4Func.perspective(this, fov, aspect, near, far);
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
        Mat4Func.ortho(this, left, right, bottom, top, near, far);
        return this;
    }
    /**
     * @function
     * @description Calculates a 4x4 matrix from the given quaternion
     * @param {quat} q Quaternion to create matrix from
     * @returns {Mat4} 
     */
    fromQuaternion(q) {
        Mat4Func.fromQuat(this, q);
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
        Mat4Func.invert(this, m);
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
        Mat4Func.fromRotationTranslationScale(this, q, pos, scale);
        return this;
    }
    /**
     * @function
     * @description Returns a quaternion representing the rotational component
     *  of a transformation matrix. If a matrix is built with
     *  fromRotationTranslation, the returned quaternion will be the
     *  same as the quaternion originally supplied.
     * @param {mat4} q Quaternion to receive the rotation component
     * @returns {Mat4} 
     */
    getRotation(q) {
        Mat4Func.getRotation(q, this);
        return this;
    }
    extractRotation(mat4){
        let q = [];
        Mat4Func.getRotation(q, mat4);
        Mat4Func.fromQuat(this, q);
        return this;
    }
    fromRotation(rotation, axis){
        Mat4Func.fromRotation(this, rotation, axis);
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
        Mat4Func.getTranslation(pos, this);
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
        Mat4Func.getScaling(scale, this);
        return this;
    }
    /**
     * @function
     * @description  Returns the max scaling factor component of a transformation matrix. 
     * @param  {mat4} mat Matrix to be decomposed (input)
     * @returns {Number} 
     */
    getMaxScaleOnAxis() {
        return Mat4Func.getMaxScaleOnAxis(this);
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
        Mat4Func.targetTo(this, eye, target, up);
        return this;
    }
     /**
    * @function
    * @description Generates a look-at matrix with the given eye position, focal point, and up axis. If you want a matrix that actually makes an object look at another object, you should use targetTo instead.
    * @param {vec3} eye Position of the viewer
    * @param {vec3} target Point the viewer is looking at
    * @param {vec3} up vec3 pointing up
    * @returns {Mat4} 
    */
    lookAtTarget(eye, target, up) {
        Mat4Func.lookAt(this, eye, target, up);
        return this;
    }
    /**
     * @function
     * @description Calculates the determinant(行列式) of a mat4
     * @returns {Mat4} 
     */
    determinant() {
        return Mat4Func.determinant(this);
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
