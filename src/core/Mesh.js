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
        this.meshType = 'mesh';
        
        this.geometry = geometry;
        this.program = program;
        this.mode = mode;

        // Used to skip frustum culling
        this.frustumCulled = frustumCulled;

        // Override sorting to force an order
        this.renderOrder = renderOrder;

        this.modelViewMatrix = new Mat4();
        this.normalMatrix = new Mat3();

        // Add empty matrix uniforms to program if unset
        if (!this.program.uniforms.modelMatrix) {
            Object.assign(this.program.uniforms, {
                modelMatrix: { value: null }, //M
                viewMatrix: { value: null }, //V => alawaysbBe replaced by camera
                modelViewMatrix: { value: null }, //MV
                normalMatrix: { value: null }, //N
                projectionMatrix: { value: null }, //P => alawaysbBe replaced by camera
                cameraPosition: { value: null },
            });
        }
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
        this.onBeforeRender && this.onBeforeRender({ mesh: this, camera });
        // Set the matrix uniforms
        if (camera) {
            //replaced by camera matrix
            this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
            this.program.uniforms.cameraPosition.value = camera.position;
            this.program.uniforms.viewMatrix.value = camera.viewMatrix;

            this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
            this.normalMatrix.getNormalMatrix(this.modelViewMatrix);

            //replaced by mesh matrix
            this.program.uniforms.modelMatrix.value = this.matrix;
            this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
            this.program.uniforms.normalMatrix.value = this.normalMatrix;
        }

        // determine if faces need to be flipped - when mesh scaled negatively
        let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;

        // Check here if any bindings can be skipped
        const programActive = this.gl.renderer.currentProgram === this.program.id;
        const geometryBound = this.gl.renderer.currentGeometry === this.geometry.id;

        this.program.use({ programActive, flipFaces });
        this.geometry.draw({ mode: this.mode, program: this.program, geometryBound });

        this.onAfterRender && this.onAfterRender({ mesh: this, camera });
    }
}