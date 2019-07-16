import { Mesh, Color, Program, Vec4, Vec3, Mat3, Mat4, Camera, RenderTarget, Transform } from '../../Core.js';
import { Plane } from '../../Extras.js';
import reflectorShader from './shaders/reflectorShader.js';

/**
 * Create a Reflector Mesh
 * 
 * @class
 * @extends Geometry
 * @param {Geometry}- The reflective geometry
 * @param {Object} [options] -  The optional plane parameters
 */
export class Reflector extends Mesh {
	constructor(geometry, {
		shader = reflectorShader,
		clipBias = 0.003,
		textureWidth = 512,
		textureHeight = 512,
		color = new Color(.46),
	} = {}) {
		let gl = geometry.gl;
		let reflectorPlane = {
			normal: new Vec3(1, 0, 0),
			constant: 0,
			v1: new Vec3(),
			m1: new Mat3(),
			m2: new Mat4(),
		};
		let normal = new Vec3();
		let reflectorWorldPosition = new Vec3();
		let cameraWorldPosition = new Vec3();
		let rotationMatrix = new Mat4();
		let lookAtPosition = new Vec3(0, 0, -1);
		let clipPlane = new Vec4();
		let viewport = new Vec4();

		let view = new Vec3();
		let target = new Vec3();
		let q = new Vec4();

		let textureMatrix = new Mat4();
		let virtualCamera = new Camera();

		let renderTarget = new RenderTarget(gl, {
			width: textureWidth,
			height: textureHeight,
			format: gl.RGB,
		});

		let program = new Program(gl, {
			vertex: shader.vertex,
			fragment: shader.fragment,
			uniforms: {
				color: { value: color },
				tDiffuse: { value: renderTarget.texture },
				textureMatrix: { value: textureMatrix },
			}
		});
		super(gl, { geometry, program });

		this.renderOrder = - Infinity; // render first
		this.meshType = 'reflectorMesh';

		this.render = ({ scene, camera }) => {
			let renderer = this.gl.renderer;
			camera.updateMatrixWorld();
			this.updateMatrixWorld();
			reflectorWorldPosition.setFromMatrixPosition(this.worldMatrix);
			cameraWorldPosition.setFromMatrixPosition(camera.worldMatrix);
			rotationMatrix.extractRotation(this.worldMatrix);

			// 1.Caculate VirtualCamera
			normal.set(0, 0, 1);
			normal.applyMatrix4(rotationMatrix);

			view.sub(reflectorWorldPosition, cameraWorldPosition);// incidence ray

			// Avoid rendering when reflector is facing away
			if (view.dot(normal) > 0) return;

			view.reflect(normal).negate();// reflect ray
			view.add(reflectorWorldPosition);// move to reflecting plane symmetric point(virtualCamera pos)

			rotationMatrix.extractRotation(camera.worldMatrix);// synchronous rotation

			lookAtPosition.set(0, 0, -1);
			lookAtPosition.applyMatrix4(rotationMatrix);
			lookAtPosition.add(cameraWorldPosition);

			target.sub(reflectorWorldPosition, lookAtPosition);
			target.reflect(normal).negate();
			target.add(reflectorWorldPosition);

			virtualCamera.position.copy(view);
			virtualCamera.up.set(0, 1, 0);
			virtualCamera.up.applyMatrix4(rotationMatrix);
			virtualCamera.up.reflect(normal);
			virtualCamera.lookAt(target);

			virtualCamera.far = camera.far; // Used in WebGLBackground

			virtualCamera.updateMatrixWorld();
			virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

			// 2.Update TextureMatrix
			textureMatrix.set(
				0.5, 0.0, 0.0, 0,
				0.0, 0.5, 0.0, 0,
				0.0, 0.0, 0.5, 0,
				0.5, 0.5, 0.5, 1.0
			);//Clip Space:[-1,1] => UV:[0,1]
			textureMatrix.multiply(virtualCamera.projectionMatrix);//P
			textureMatrix.multiply(virtualCamera.viewMatrix);//V
			textureMatrix.multiply(this.worldMatrix);//M

			// 3.Update projection ClipPlane
			// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
			// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
			
			//setFromNormalAndCoplanarPoint
			reflectorPlane.normal.copy(normal);
			reflectorPlane.constant = -reflectorWorldPosition.dot(reflectorPlane.normal);

			//reflectorPlane.applyMatrix4
			reflectorPlane.m1.getNormalMatrix(virtualCamera.viewMatrix);
			reflectorPlane.v1.copy(reflectorPlane.normal).multiply(-reflectorPlane.constant);
			reflectorPlane.v1.applyMatrix4(virtualCamera.viewMatrix);
			reflectorPlane.normal.applyMatrix3(reflectorPlane.m1).normalize();
			reflectorPlane.constant = -reflectorPlane.v1.dot(reflectorPlane.normal);

			clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);

			let projectionMatrix = virtualCamera.projectionMatrix;
			q.x = (Math.sign(clipPlane.x) + projectionMatrix[8]) / projectionMatrix[0];
			q.y = (Math.sign(clipPlane.y) + projectionMatrix[9]) / projectionMatrix[5];
			q.z = - 1.0;
			q.w = (1.0 + projectionMatrix[10]) / projectionMatrix[14];

			// Calculate the scaled plane vector
			let res = 2.0 / clipPlane.dot(q);
			clipPlane.multiply(res);

			// Replacing the third row of the projection matrix
			projectionMatrix[2] = clipPlane.x;
			projectionMatrix[6] = clipPlane.y;
			projectionMatrix[10] = clipPlane.z + 1.0 - clipBias;
			projectionMatrix[14] = clipPlane.w;

			// Render
			this.visible = false;
			renderer.render({ scene, camera: virtualCamera, target: renderTarget });
			this.visible = true;
		}
	}
}
