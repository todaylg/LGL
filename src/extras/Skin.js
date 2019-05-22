import {Mesh} from '../core/Mesh.js';
import {Transform} from '../core/Transform.js';
import {Mat4} from '../math/Mat4.js';
import {Texture} from '../core/Texture.js';
import {Animation} from './Animation.js';

const tempMat4 = new Mat4();

export class Skin extends Mesh {
    constructor(gl, {
        geometry,
        program,
        mode = gl.TRIANGLES,
    } = {}) {
        super(gl, {geometry, program, mode});
        this.animations = [];
    }

    init(rig = {}){
        this.createBones(rig);
        this.createBoneTexture();
    }
    
    createBones(rig) {
        let { bones, boneInverses } = rig;
        if (!bones || !bones.length) return;
        this.root = bones[0];
        this.bones = bones.slice(0);
        // Store inverse of bind pose to calculate differences
        if (boneInverses && boneInverses.length === bones.length) {
            this.bones.forEach((bone,i) => {
                bone.bindInverse = boneInverses[i];
            });
        }else{
            console.warn('No input boneInverses or boneInverses is the wrong length.');
            this.bones.forEach(bone => {
                bone.bindInverse = new Mat4(bone.worldMatrix).inverse();
            });
        }
    }

    createBoneTexture() {
        if (!this.bones.length) return;
        // layout (1 matrix = 4 pixels)  => use texture to save boneMatrices data
        //      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
        //  with  8x8  pixel texture max   16 bones * 4 pixels =  (8 * 8)
        //       16x16 pixel texture max   64 bones * 4 pixels = (16 * 16)
        //       32x32 pixel texture max  256 bones * 4 pixels = (32 * 32)
        //       64x64 pixel texture max 1024 bones * 4 pixels = (64 * 64)
        // let size = Math.sqrt( bones.length * 4 ); // 4 pixels needed for 1 matrix
        // size = _Math.ceilPowerOfTwo( size );
        // size = Math.max( size, 4 );
        const size = Math.max(4, Math.pow(2, Math.ceil(Math.log(Math.sqrt(this.bones.length * 4)) / Math.LN2)));
        this.boneMatrices = new Float32Array(size * size * 4);
        this.boneTextureSize = size;
        this.boneTexture = new Texture(this.gl, {
            image: this.boneMatrices,
            generateMipmaps: false,
            type: this.gl.FLOAT,
            internalFormat: this.gl.renderer.isWebgl2 ? this.gl.RGBA16F : this.gl.RGBA,
            flipY: false,
            width: size,
        });
        // pass to shader
        Object.assign(this.program.uniforms, {
            boneTexture: {value: this.boneTexture},
            boneTextureSize: {value: this.boneTextureSize},
        });
    }

    addAnimation(data) {
        const animation = new Animation({objects: this.bones, data});
        this.animations.push(animation);
        return animation;
    }

    update() {
        // Calculate combined animation weight
        let total = 0;
        if(!this.animations.length) return;
        this.animations.forEach(animation => total += animation.weight);
        this.animations.forEach((animation, i) => {
            // force first animation to set in order to reset frame
            animation.update(total, i === 0);
        });
    }

    draw({
        camera,
    } = {}) {
        // Calling 'update' updates the bones with all of the
        // attached animations based on their weights.
        this.update();
        // Update world matrices manually, as not part of scene graph
        this.root.updateMatrixWorld(true);

        // Update bone texture
        this.bones.forEach((bone, i) => {
            // Find difference between current and bind pose
            tempMat4.multiply(bone.worldMatrix, bone.bindInverse);
            this.boneMatrices.set(tempMat4, i * 16);
        });
        // update the boneMatrices change to shader
        if (this.boneTexture) this.boneTexture.needsUpdate = true;

        super.draw({camera});
    }
}
