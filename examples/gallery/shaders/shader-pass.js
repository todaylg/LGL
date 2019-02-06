import { Renderer, Geometry, Program, Mesh, Camera, Transform, Texture, Color, Vec3, Vec2, RenderTarget } from '../../../src/Core.js';
import { Plane, Sphere, Orbit, Torus, Post } from '../../../src/Extras.js';

class ShaderPass {
  constructor(renderer, shader, width, height, minFilter, magFilter, wrapS, wrapT) {
    this.renderer = renderer;
    this.gl = renderer.gl;
    this.shader = shader;
    this.orthoScene = new Transform();
    this.fbo = new RenderTarget(this.gl, {
      width, height,
      wrapS,
      wrapT,
      minFilter,
      magFilter
    });
    this.orthoCamera = new Camera({
      left: width / -2, right: width / 2, bottom: height / -2, top: height / 2, near: .00001,
      far: 1000
    });
    this.orthoQuad = new Mesh(this.gl, {
      geometry: new Plane(this.gl, 1, 1),
      program: this.shader
    });
    this.orthoQuad.scale.set(width, height, 1.);
    this.orthoScene.addChild(this.orthoQuad);
    this.texture = this.fbo.texture;
  }

  render(final) {
    this.renderer.render({
      scene: this.orthoScene,
      camera: this.orthoCamera,
      target: final ? null : this.fbo
    })
  }

    setSize(width, height) {

      this.orthoQuad.scale.set(width, height, 1.);

      this.fbo.setSize(width, height);

      this.orthoQuad.scale.set(width, height, 1);

      this.orthoCamera.left = -width / 2;
      this.orthoCamera.right = width / 2;
      this.orthoCamera.top = height / 2;
      this.orthoCamera.bottom = -height / 2;
      this.orthoCamera.updateProjectionMatrix();

    }

  }

  export default ShaderPass;