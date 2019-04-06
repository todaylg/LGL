import { Vec3 } from '../math/Vec3.js';
import { Quat } from '../math/Quat.js';
import { Mat4 } from '../math/Mat4.js';
import { Euler } from '../math/Euler.js';

/**
 * The base class for objects that are rendered on the screen.
 *
 * @class
 */
export class Transform {
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