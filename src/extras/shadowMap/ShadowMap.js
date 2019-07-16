import { Program, Transform, RenderTarget, Camera, Vec3, Mat4 } from '../../Core.js';
import simpleDepthShader from './shaders/simpleDepthShader.js';
let tempMat4 = new Mat4();
export class ShadowMap {
    //Init param
    constructor(gl, options = {}) {
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
            far: 100,
        });
        //Test
        this.lightArr = options.lightArr;
        this.center = new Vec3(0, 0, 0);
        this.up = new Vec3(0, 1, 0);
        this.depthBuffer = [];
        this.depthMap = [];
        this.lightSpaceMatrix = [];

        for (let i = 0; i < this.lightArr.length; i++) {
            this.depthBuffer[i] = new RenderTarget(gl, {
                width: 1024*2,
                height: 1024*2,
                depthTexture: true
            });
            this.depthMap[i] = this.depthBuffer[i].depthTexture;
            this.lightSpaceMatrix[i] = new Mat4();
        }
    }
    calculateLightSpaceMatrix(lightPos, lightSpaceMatrix) {
        tempMat4.lookAt(lightPos, this.center, this.up);//V
        lightSpaceMatrix.multiply(this.shadowCamera.projectionMatrix, tempMat4);//P
    }
    renderDepthTexture(scene) {
        let lightArr = this.lightArr;
        for (let i = 0; i < lightArr.length; i++) {
            let light = lightArr[i];
            let lightSpaceMatrix = this.lightSpaceMatrix[i];
            let depthBuffer = this.depthBuffer[i];
            scene.traverse((transform) => {
                let parent = transform.parent;
                if (parent && transform.meshType && transform.castShadowMap) {
                    //Get Depth Matiral
                    //Todo: 有些变异的顶点信息需要单独处理：Skinnig和MorphTarget
                    if (transform.meshType == 'skinnedMesh') {
                        this.depthProgram.uniforms.boneMatrices = { value: transform.boneMatrices };
                    }
                    //1.setRenderTarget => target: depthMap
                    this.renderer.setRenderTarget(depthBuffer);
                    this.renderer.clear();
                    //2.renderBufferDirect
                    this.calculateLightSpaceMatrix(light.lightPos, lightSpaceMatrix);
                    if(!light.depthProgram){
                        light.depthProgram = new Program(this.gl, {
                            vertex: simpleDepthShader.vertex,
                            fragment: simpleDepthShader.fragment,
                            // cullFace: this.gl.FRONT,
                            uniforms: {
                                lightSpaceMatrix: { value: lightSpaceMatrix }
                            }
                        })
                    }
                    // console.log(this.lightSpaceMatrix[1]);
                    light.depthProgram.uniforms.worldMatrix = { value: transform.worldMatrix };
                    light.depthProgram.uniforms.modelMatrix = { value: transform.matrix };
                    let flipFaces = transform.program.cullFace && transform.worldMatrix.determinant() < 0;
                    light.depthProgram.use({ flipFaces });
                    transform.geometry.draw({
                        program: light.depthProgram 
                    });
                }
            });
        }
    }
    render(scene) {
        this.renderDepthTexture(scene);
    }
}