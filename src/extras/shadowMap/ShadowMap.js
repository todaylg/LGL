import { Program, Transform, RenderTarget, Camera, Vec3, Mat4 } from '../../Core.js';
import simpleDepthShader from './shaders/simpleDepthShader.js';
let tempMat4 = new Mat4();
export class ShadowMap {
    //Init param
    constructor(gl, options = {}) {
        this.gl = gl;
        this.renderer = gl.renderer;
        this.sceneDepth = new Transform();
        this.depthMap = new RenderTarget(gl, {
            width: 2048*4,
            height: 2048*4,
            depthTexture: true
        });
        //Direction Light
        this.lightProjection = new Camera({
            left: -100,
            right: 100,
            bottom: -100,
            top: 100,
            near: 0.1,
            far: 100,
        });
        this.lightPos = new Vec3(0, 10.0, -10);
        this.center = new Vec3(0, 0, 0);
        this.up = new Vec3(0, 1, 0);
        this.lightSpaceMatrix = new Mat4();
        this.calculateLightSpaceMatrix();
    }
    calculateLightSpaceMatrix(){
        tempMat4.lookAt(this.lightPos, this.center, this.up);
        this.lightSpaceMatrix.multiply(this.lightProjection.projectionMatrix, tempMat4);
        this.sceneDepth.updateMatrixWorld(true);
    }
    //Init shadow
    init(scene) {
        this.scene = scene;
        this.depthProgram = new Program(this.gl, {
            vertex: simpleDepthShader.vertex,
            fragment: simpleDepthShader.fragment,
            // cullFace: gl.FRONT,
            uniforms: {
                lightSpaceMatrix: { value: this.lightSpaceMatrix }
            }
        });
        //Copy Scene
        this.sceneDepth = scene.clone();
        this.sceneDepth.traverse((transform)=>{
            let parent = transform.parent;
            if(parent && transform.meshType){
                let cloneMesh = transform.clone({ program: this.depthProgram });
                let children = parent.children;
                let index = children.indexOf(transform);
                if(!~index) return;
                cloneMesh.parent = parent;
                children[index] = cloneMesh;
                transform.setParent(null, false);
            }
        });
        console.log("sceneDepth: ", this.sceneDepth);
    }
    render() {
        let { renderer, sceneDepth, depthMap } = this;
        if(!this.sceneDepth) return;
        this.calculateLightSpaceMatrix();
        renderer.render({ scene: sceneDepth, target: depthMap });
    }
}