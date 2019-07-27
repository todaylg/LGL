import { Program, Transform, RenderTarget, Camera, Vec3, Mat4, Color } from '../../Core.js';
import simpleDepthShader from './shaders/simpleDepthShader.js';
let tempMat4 = new Mat4();
let tempVec3 = new Vec3();
// px nx py ny pz nz
let pointCameraLookCenter = [new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 1, 0), new Vec3(0, -1, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1)];
let pointCameraLookUp = [new Vec3(0, -1, 0), new Vec3(0, -1, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1), new Vec3(0, -1, 0), new Vec3(0, -1, 0)];
export class ShadowMap {
    //Init param
    constructor(gl, lightArr) {
        this.gl = gl;
        this.renderer = gl.renderer;
        this.sceneDepth = new Transform();

        this.lightArr = lightArr;
        this.center = new Vec3(0, 0, 0);
        this.up = new Vec3(0, 1, 0);
        this.depthBuffer = [];
        this.depthMap = [];
        this.lightSpaceMatrix = [];
        this.lightPos = [];

        for (let i = 0; i < this.lightArr.length; i++) {
            let light = this.lightArr[i];
            light.lightSpaceMatrix = new Mat4();
            light.lightColor = light.lightColor || new Color(1);
            light.depthBuffer = new RenderTarget(gl, {
                width: 1024 * 2,
                height: 1024 * 2,
                depthTexture: true,
                cubeMapFlag: light.lightType === 'point' ? true : false  //Point Light => Cube Depth Map
            });
            light.depthTexture = light.depthBuffer.depthTexture;
            switch (light.lightType) {
                case 'dir':
                    //OrthoCamera
                    light.shadowCamera = new Camera({
                        left: light.shadowCameraLeft || -100,
                        right: light.shadowCameraRight || 100,
                        bottom: light.shadowCameraBottom || -100,
                        top: light.shadowCameraTop || 100,
                        near: light.shadowCameraNear || .1,
                        far: light.shadowCameraFar || 400,
                    });
                    break;
                case 'spot':
                    //PerspectiveCamera
                    light.shadowCamera = new Camera({
                        near: light.shadowCameraNear || .1,
                        far: light.shadowCameraFar || 400,
                        fov: light.shadowCameraFov || 90,
                    });
                    break;
                case 'point':
                    //Todo: Cube-PerspectiveCamera
                    light.shadowCamera = new Camera({
                        near: light.shadowCameraNear || .1,
                        far: light.shadowCameraFar || 100,
                        fov: light.shadowCameraFov || 90,
                    });
                    break;
                default:
                    break;
            }
        }
    }
    calLightSpaceMatrix(light, center, up) {
        let { lightPos, shadowCamera, lightSpaceMatrix } = light;
        tempMat4.lookAtTarget(lightPos, center, up);//V
        lightSpaceMatrix.multiply(shadowCamera.projectionMatrix, tempMat4);//P
    }
    renderScene(scene, light, lookCenter = this.center, lookUp = this.up) {
        //Todo: frustum culling
        scene.traverse((transform) => {
            let parent = transform.parent;
            if (parent && transform.meshType && transform.castShadowMap) {
                let shaderDefines = `#version 300 es\n`;
                // Variable vertex information needs to be processed separately：Skinnig/MorphTarget
                if (transform.meshType == 'skinnedMesh' && !transform.shadowProgram) {
                    shaderDefines += `#define USE_SKINNING 1\n`;
                    transform.shadowProgram = new Program(this.gl, {
                        vertex: shaderDefines + simpleDepthShader.vertex,
                        fragment: simpleDepthShader.fragment,
                        cullFace: this.gl.FRONT,
                        uniforms: {
                            boneTexture: { value: transform.boneTexture },
                            boneTextureSize: { value: transform.boneTextureSize }
                        }
                    })
                } else if (!transform.shadowProgram) {
                    transform.shadowProgram = new Program(this.gl, {
                        vertex: shaderDefines + simpleDepthShader.vertex,
                        fragment: simpleDepthShader.fragment,
                        cullFace: this.gl.FRONT
                    })
                }
                this.calLightSpaceMatrix(light, lookCenter, lookUp);
                transform.shadowProgram.uniforms.lightSpaceMatrix = { value: light.lightSpaceMatrix };
                transform.shadowProgram.uniforms.worldMatrix = { value: transform.worldMatrix };
                transform.shadowProgram.uniforms.modelMatrix = { value: transform.matrix };

                let flipFaces = transform.program.cullFace && transform.worldMatrix.determinant() < 0;
                transform.shadowProgram.use({ flipFaces });

                transform.geometry.draw({
                    program: transform.shadowProgram
                });
            }
        });
    }
    render(scene) {
        let lightArr = this.lightArr;
        for (let i = 0; i < lightArr.length; i++) {
            let light = lightArr[i];
            let depthBuffer = light.depthBuffer;
            //1.setRenderTarget => target: depthMap
            this.renderer.setRenderTarget(depthBuffer);
            this.renderer.clear();
            if (light.lightType === 'point') {
                // Need draw 6 faces
                for (let i = 0; i < 6; i++) {
                    this.gl.framebufferTexture2D(depthBuffer.target, this.gl.DEPTH_ATTACHMENT, this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, light.depthTexture.texture, 0);
                    this.renderer.clear(false, true, false);
                    tempVec3.add(light.lightPos, pointCameraLookCenter[i]);
                    this.renderScene(scene, light, tempVec3, pointCameraLookUp[i]);
                }
            } else {
                this.renderScene(scene, light);
            }
        }
    }
}