import { Program, Transform, RenderTarget, Camera, Vec3, Mat4 } from '../../Core.js';
import simpleDepthShader from './shaders/simpleDepthShader.js';
let tempMat4 = new Mat4();
export class ShadowMap {
    //初始化深度贴图
    constructor(gl, options = {}) {
        this.gl = gl;
        this.renderer = gl.renderer;
        this.sceneDepth = new Transform();
        this.depthMap = new RenderTarget(gl, {
            width: 1024*8,
            height: 1024*8,
            depthTexture: true
        });
        this.lightProjection = new Camera({
            left: -100,
            right: 100,
            bottom: -100,
            top: 100,
            near: 0.1,
            far: 100,
        });//Directional light
        this.lightPos = new Vec3(0, 10.0, -10);
        this.center = new Vec3(0, 0, 0);
        this.up = new Vec3(0, 1, 0);
        this.lightSpaceMatrix = new Mat4();
        this.calculateLightSpaceMatrix();
    }
    calculateLightSpaceMatrix(){
        tempMat4.lookAt(this.lightPos, this.center, this.up);
        this.lightSpaceMatrix.multiply(this.lightProjection.projectionMatrix, tempMat4);
    }
    //场景初始化完毕
    init(scene) {
        this.scene = scene;
        //遍历Scene并赋值sceneDepth
        this.depthProgram = new Program(this.gl, {
            vertex: simpleDepthShader.vertex,
            fragment: simpleDepthShader.fragment,
            // cullFace: gl.FRONT,
            uniforms: {
                lightSpaceMatrix: { value: this.lightSpaceMatrix }
            }
        });
        scene.traverse((transform)=>{
            if(!transform.castShadowMap) return;
            let cloneMesh = transform.clone({ program: this.depthProgram });
            this.sceneDepth.addChild(cloneMesh);
        })
    }
    render() {
        //对象引用同步原场景Tranform
        let { renderer, sceneDepth, depthMap } = this;
        this.calculateLightSpaceMatrix();
        renderer.render({ scene: sceneDepth, target: depthMap });
    }
}