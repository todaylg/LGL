import { Mat4 } from '../math/Mat4.js';
import { Transform } from '../core/Transform.js';

class Bone extends Transform {
    constructor() {
        this.isBone = true;
        super();
    }
}

class Skeleton {
    constructor(bones = [], boneInverses) {
        this.bones = bones.slice(0);
        this.boneMatrices = new Float32Array(this.bones.length * 16);

        this.offsetMatrix = new Mat4();
        this.identityMatrix = new Mat4();

        if (boneInverses === undefined) {
            this.calculateInverses();
        } else {
            if (this.bones.length === boneInverses.length) {
                this.boneInverses = boneInverses.slice(0);
            } else {
                console.warn('BoneInverses is the wrong length.');
                this.boneInverses = [];
                for (var i = 0, il = this.bones.length; i < il; i++) {
                    this.boneInverses.push(new Mat4());
                }
            }
        }
    }
    calculateInverses() {
        this.boneInverses = [];
        for (let i = 0, il = this.bones.length; i < il; i++) {
            let inverse = new Mat4();
            if (this.bones[i]) {
                inverse.inverse(this.bones[i].worldMatrix);
            }
            this.boneInverses.push(inverse);
        }
    }
    pose() {
        let bone, i, il;
        // recover the bind-time world matrices
        for (i = 0, il = this.bones.length; i < il; i++) {
            bone = this.bones[i];
            if (bone) {
                bone.worldMatrix.inverse(this.boneInverses[i]);
            }
        }
        // compute the local matrices, positions, rotations and scales
        for (i = 0, il = this.bones.length; i < il; i++) {
            bone = this.bones[i];
            if (bone) {
                if (bone.parent && bone.parent.isBone) {
                    bone.matrix.getInverse(bone.parent.worldMatrix);
                    bone.matrix.multiply(bone.worldMatrix);
                } else {
                    bone.matrix.copy(bone.worldMatrix);
                }
                bone.decompose(bone.matrix);
            }
        }
    }
    update() {
        let { bones, boneInverses, boneMatrices, boneTexture, identityMatrix, offsetMatrix } = this;
        // flatten bone matrices to array
        for (let i = 0, il = bones.length; i < il; i++) {
            // compute the offset between the current and the original transform
            let matrix = bones[i] ? bones[i].worldMatrix : identityMatrix;
            offsetMatrix.multiply(matrix, boneInverses[i]);
            offsetMatrix.toArray(boneMatrices, i * 16);
        }
        if (boneTexture !== undefined) {
            boneTexture.needsUpdate = true;
        }
    }
    clone() {
        return new Skeleton(this.bones, this.boneInverses);
    }
    getBoneByName(name) {
        for (var i = 0, il = this.bones.length; i < il; i++) {
            var bone = this.bones[i];
            if (bone.name === name) {
                return bone;
            }
        }
        return undefined;
    }
}

export { Bone, Skeleton };
