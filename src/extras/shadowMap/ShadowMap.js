import { Program, Transform, RenderTarget, Camera, Vec3, Mat4, Color } from '../../Core.js';
import simpleDepthShader from './shaders/simpleDepthShader.js';
let tempMat4 = new Mat4();
export class ShadowMap {
    //Init param
    constructor(gl, lightArr) {
        this.gl = gl;
        this.renderer = gl.renderer;
        this.sceneDepth = new Transform();
        //Direction Light
        this.shadowCamera = new Camera({
            left: -100,
            right: 100,
            bottom: -100,
            top: 100,
            near: 0.1,
            far: 400,
        });
        //Test
        this.lightArr = lightArr;
        this.center = new Vec3(0, 0, 0);
        this.up = new Vec3(0, 1, 0);
        this.depthBuffer = [];
        this.depthMap = [];
        this.lightSpaceMatrix = [];
        this.lightPos = [];
        this.loadingSkinningFlag = false;

        for (let i = 0; i < this.lightArr.length; i++) {
            let light = this.lightArr[i];
            light.depthBuffer = new RenderTarget(gl, {
                width: 1024*2,
                height: 1024*2,
                depthTexture: true
            });
            light.depthTexture = light.depthBuffer.depthTexture;
            light.lightSpaceMatrix = new Mat4();
            light.lightColor = light.lightColor || new Color(1);
        }
    }
    calculateLightSpaceMatrix(lightPos, lightSpaceMatrix) {
        tempMat4.lookAtTarget(lightPos, this.center, this.up);//V
        lightSpaceMatrix.multiply(this.shadowCamera.projectionMatrix, tempMat4);//P
    }
    renderDepthTexture(scene) {
        let lightArr = this.lightArr;
        for (let i = 0; i < lightArr.length; i++) {
            let light = lightArr[i];
            let lightSpaceMatrix = light.lightSpaceMatrix;
            let depthBuffer = light.depthBuffer;
            //1.setRenderTarget => target: depthMap
            this.renderer.setRenderTarget(depthBuffer);
            this.renderer.clear();
            scene.traverse((transform) => {
                let parent = transform.parent;
                if (parent && transform.meshType && transform.castShadowMap) {
                    //Todo: 有些变异的顶点信息需要单独处理：Skinnig和MorphTarget
                    let shaderDefines = `#version 300 es\n`;
                    //必须要Cache
                    if (transform.meshType == 'skinnedMesh' && !transform.shadowProgram) {
                        shaderDefines += `#define USE_SKINNING 1\n`;
                        transform.shadowProgram = new Program(this.gl, {
                            vertex: shaderDefines + simpleDepthShader.vertex,
                            fragment: simpleDepthShader.fragment,
                            uniforms: {
                                boneTexture: { value: transform.boneTexture },
                                boneTextureSize: { value: transform.boneTextureSize }
                            }
                        })
                    }else if(!transform.shadowProgram){
                        transform.shadowProgram = new Program(this.gl, {
                            vertex: shaderDefines + simpleDepthShader.vertex,
                            fragment: simpleDepthShader.fragment,
                        })
                    }
                    this.calculateLightSpaceMatrix(light.lightPos, lightSpaceMatrix);
                    transform.shadowProgram.uniforms.lightSpaceMatrix = { value: lightSpaceMatrix };
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
    }
    render(scene) {
        this.renderDepthTexture(scene);
    }
}