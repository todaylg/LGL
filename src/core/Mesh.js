import { Transform } from './Transform.js';
import { Mat3 } from '../math/Mat3.js';
import { Mat4 } from '../math/Mat4.js';

let ID = 0;

/**
 * Create Mesh
 * 
 * @class
 * @extends Transform
 * @param {WebGLContext} gl
 * @param {Object} [options] -  The optional mesh parameters
 * @param {Geometry} [options.geometry] - The geometry of mesh
 * @param {Program} [options.program] -  The program of mesh
 * @param {GLenum} [options.mode=gl.TRIANGLES] - A GLenum specifying the type primitive to render
 * @param {Boolean} [options.frustumCulled=true] - Whether enable frustum Culled
 * @param {Number} [options.renderOrder=0] - The render order
 */
export class Mesh extends Transform {
    constructor(gl, {
        geometry,
        program,
        mode = gl.TRIANGLES,
        frustumCulled = true,
        renderOrder = 0,
    } = {}) {
        super();
        this.gl = gl;
        this.id = ID++;
        this.isMesh = true;

        this.geometry = geometry;
        this.program = program;
        this.mode = mode;

        // Used to skip frustum culling
        this.frustumCulled = frustumCulled;

        // Override sorting to force an order
        this.renderOrder = renderOrder;

        this.modelViewMatrix = new Mat4();
        this.normalMatrix = new Mat3();

        this.beforeRenderCallbacks = [];
        this.afterRenderCallbacks = [];

        // Add empty matrix uniforms to program if unset
        if (!this.program.uniforms.modelMatrix) {
            Object.assign(this.program.uniforms, {
                modelMatrix: { value: null }, // M
                viewMatrix: { value: null }, // V => always be replaced by camera
                modelViewMatrix: { value: null }, // MV
                normalMatrix: { value: null }, //N 
                projectionMatrix: { value: null }, //P => alaways replaced by camera
                cameraPosition: { value: null },
                worldMatrix: { value: null },
            });
        }
    }
    
    /**
     * Before Render Hook
     */
    onBeforeRender(f) {
        this.beforeRenderCallbacks.push(f);
        return this;
    }

    /**
     * After Render Hook
     */
    onAfterRender(f) {
        this.afterRenderCallbacks.push(f);
        return this;
    }

    /**
     * Render the Mesh
     * 
     * @param {Object} [options] -  The optional mesh parameters
     * @param {Camera} [options.camera] - The view of mesh
     */
    draw({
        camera,
    } = {}) {
        this.beforeRenderCallbacks.forEach(f => f && f({mesh: this, camera}));
        // Set the matrix uniforms
        if (camera) {
            // Replaced by camera matrix
            this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
            this.program.uniforms.cameraPosition.value = camera.position;
            this.program.uniforms.viewMatrix.value = camera.viewMatrix;

            this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
            this.normalMatrix.getNormalMatrix(this.modelViewMatrix);

            // Replaced by mesh matrix
            this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
            this.program.uniforms.normalMatrix.value = this.normalMatrix;
        }

        this.program.uniforms.worldMatrix.value = this.worldMatrix;
        this.program.uniforms.modelMatrix.value = this.matrix;
        // Determine if faces need to be flipped - when mesh scaled negatively(determinant < 0)
        let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;

        this.program.use({flipFaces});
        this.geometry.draw({mode: this.mode, program: this.program});

        this.afterRenderCallbacks.forEach(f => f && f({mesh: this, camera}));
    }
}