import particleShader from './shaders/particleShader.js';
import ParticleContainer from './ParticleContainer.js';
import { Texture, Program, Transform } from '../../Core.js';

export class ParticleSystem extends Transform{
	constructor(gl, {
		maxParticles = 100000,
		containerCount = 1,
		particleNoiseTex = null,
		particleSpriteTex = null,
		perContainer = maxParticles / containerCount,
		shaderSource = particleShader
	} = {}) {
		super();
		this.gl = gl;
		this.dpr = gl.renderer.dpr;
		this.maxParticles = maxParticles;
		this.containerCount = containerCount;
		this.perContainer = perContainer;
		this.shaderSource = shaderSource;

		this.particleCursor = 0;
		this.time = 0;
		this.particleContainers = [];
		this.rand = [];

		// pseudorandom
		this.randomIndex = 1e5;
		for (; this.randomIndex > 0; this.randomIndex--) {
			this.rand.push(Math.random() - 0.5);
		}

		this.program = new Program(gl, {
			vertex: shaderSource.vertex,
			fragment: shaderSource.fragment,
			uniforms: {
				'uTime': {
					value: 0.0
				},
				'uScale': {
					value: 2.0
				},
				'tNoise': {
					value: particleNoiseTex || this.loadTextureFromSrc('./assets/images/perlin-512.png')
				},
				'tSprite': {
					value: particleSpriteTex || this.loadTextureFromSrc('./assets/images/particle.png')
				}
			},
			transparent: true,
			depthWrite: false,
			blendMode: 'Add'
		})
		this.init();
	}
	random() {
		return ++this.randomIndex >= this.rand.length ? this.rand[this.randomIndex = 1] : this.rand[this.randomIndex];
	}
	loadTextureFromSrc(src) {
		let gl = this.gl;
		const texture = new Texture(gl, {
			wrapS: gl.REPEAT,
			wrapT: gl.REPEAT,
		});
		const image = new Image();
		image.crossOrigin = "anonymous";
		image.onload = () => {
			texture.image = image;
		};
		image.src = src;
		return texture;
	}
	init() {
		for (let i = 0; i < this.containerCount; i++) {
			let container = new ParticleContainer(this.perContainer, this);
			this.particleContainers.push(container);
			this.addChild(container);
		}
	}
	spawnParticle(options){
		this.particleCursor++;
		if (this.particleCursor >= this.maxParticles) {
			this.particleCursor = 1;
		}
		let currentContainer = this.particleContainers[ Math.floor( this.particleCursor / this.perContainer ) ];
		currentContainer.spawnParticle( options );
	}
	update(time){
		for ( let i = 0; i < this.containerCount; i ++ ) {
			this.particleContainers[i].update( time );
		}
	}
}
