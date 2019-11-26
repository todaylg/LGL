import { Transform } from "./Transform.js";
import { Mat4 } from "../math/Mat4.js";
import { Vec3 } from "../math/Vec3.js";

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
 * new Camera({ fov: 45 })
 */
export class Camera extends Transform {
  constructor({
    near = 0.1,
    far = 100,
    fov = 45,
    aspect = 1,
    left,
    right,
    bottom,
    top
  } = {}) {
    super();
    this.near = near;
    this.far = far;
    this.fov = fov;
    this.aspect = aspect;

    this.projectionMatrix = new Mat4();
    this.viewMatrix = new Mat4();
    this.projectionViewMatrix = new Mat4();
    this.worldPosition = new Vec3();

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
    aspect = this.aspect
  } = {}) {
    this.projectionMatrix.fromPerspective({
      fov: fov * (Math.PI / 180),
      aspect,
      near,
      far
    });
    this.type = "perspective";
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
    top = 1
  } = {}) {
    this.projectionMatrix.fromOrthogonal({
      left,
      right,
      bottom,
      top,
      near,
      far
    });
    this.type = "orthographic";
    return this;
  }

  /**
   * Update the world matrix
   */
  updateMatrixWorld() {
    super.updateMatrixWorld();
    this.viewMatrix.inverse(this.worldMatrix); // change current world coordinates to camera coordinates
    this.worldMatrix.getTranslation(this.worldPosition);

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
      this.frustum = [
        new Vec3(),
        new Vec3(),
        new Vec3(),
        new Vec3(),
        new Vec3(),
        new Vec3()
      ];
    }
    const m = this.projectionViewMatrix;
    this.frustum[0].set(m[3] - m[0], m[7] - m[4], m[11] - m[8]).constant =
      m[15] - m[12]; // -x
    this.frustum[1].set(m[3] + m[0], m[7] + m[4], m[11] + m[8]).constant =
      m[15] + m[12]; // +x
    this.frustum[2].set(m[3] + m[1], m[7] + m[5], m[11] + m[9]).constant =
      m[15] + m[13]; // +y
    this.frustum[3].set(m[3] - m[1], m[7] - m[5], m[11] - m[9]).constant =
      m[15] - m[13]; // -y
    this.frustum[4].set(m[3] - m[2], m[7] - m[6], m[11] - m[10]).constant =
      m[15] - m[14]; // +z (far)
    this.frustum[5].set(m[3] + m[2], m[7] + m[6], m[11] + m[10]).constant =
      m[15] + m[14]; // -z (near)

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
    if (!node.geometry.bounds || node.geometry.bounds.radius === Infinity)
      node.geometry.computeBoundingSphere();

    const center = tempVec3a;
    center.copy(node.geometry.bounds.center);
    center.applyMatrix4(node.worldMatrix);

    const radius =
      node.geometry.bounds.radius * node.worldMatrix.getMaxScaleOnAxis();

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
