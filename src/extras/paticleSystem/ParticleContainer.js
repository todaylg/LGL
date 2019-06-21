import { Transform, Geometry, Mesh, Vec3, Color } from "../../Core.js";

let tempPosition = new Vec3();
let tempVelocity = new Vec3();
let tempColor = new Color(1,1,1);

export default class ParticleContainer extends Transform {
    constructor(maxParticles, particleSystem) {
        super();
        this.particleCount = maxParticles || 50000;
        this.particleSystem = particleSystem;
        this.particleCursor = 0;
        this.time = 0;
        this.offset = 0;
        this.count = 0;
        this.gl = particleSystem.gl;
        this.dpr = particleSystem.dpr;
        this.particleUpdate = false;

        this.positionAttr = new Float32Array(this.particleCount * 3);
        this.positionStartAttr = new Float32Array(this.particleCount * 3);
        this.startTimeAttr = new Float32Array(this.particleCount);
        this.velocityAttr = new Float32Array(this.particleCount * 3);
        this.turbulenceAttr = new Float32Array(this.particleCount);
        this.colorAttr = new Float32Array(this.particleCount * 3);
        this.sizeAttr = new Float32Array(this.particleCount);
        this.lifeTimeAttr = new Float32Array(this.particleCount);

        this.particleGeo = new Geometry(this.gl, {
            position: { size: 3, data: this.positionAttr, dataMode: this.gl.DYNAMIC_DRAW },
            positionStart: { size: 3, data: this.positionStartAttr, dataMode: this.gl.DYNAMIC_DRAW },
            startTime: { size: 1, data: this.startTimeAttr, dataMode: this.gl.DYNAMIC_DRAW },
            velocity: { size: 3, data: this.velocityAttr, dataMode: this.gl.DYNAMIC_DRAW },
            turbulence: { size: 1, data: this.turbulenceAttr, dataMode: this.gl.DYNAMIC_DRAW },
            color: { size: 3, data: this.colorAttr, dataMode: this.gl.DYNAMIC_DRAW },
            size: { size: 1, data: this.sizeAttr, dataMode: this.gl.DYNAMIC_DRAW },
            lifeTime: { size: 1, data: this.lifeTimeAttr, dataMode: this.gl.DYNAMIC_DRAW },
        });
        this.program = particleSystem.program;
        this.init();
    }
    init(){
        this.particleSystemMesh = new Mesh(this.gl, {
            mode: this.gl.POINTS, 
            geometry: this.particleGeo, 
            program: this.program,
            frustumCulled: false
        });
		this.addChild( this.particleSystemMesh );
    }
    update(time){
        this.time = time;
		this.program.uniforms.uTime.value = time;
		this.geometryUpdate();
    }
    geometryUpdate(){
        let geo = this.particleGeo;
        geo.attributes['positionStart'].needsUpdate = true;
        geo.attributes['startTime'].needsUpdate = true;
        geo.attributes['velocity'].needsUpdate = true;
        geo.attributes['turbulence'].needsUpdate = true;
        geo.attributes['color'].needsUpdate = true;
        geo.attributes['size'].needsUpdate = true;
        geo.attributes['lifeTime'].needsUpdate = true;
    }
    spawnParticle({
        position = tempPosition,
        velocity = tempVelocity,
        color = tempColor,
        positionRandomness = 0,
        velocityRandomness = 0,
        colorRandomness = 1,
        turbulence = 1,
        lifetime = 5,
        size = 10,
        sizeRandomness = 0,
        smoothPosition = false
    } = {}) {
        if (this.dpr !== undefined) size *= this.dpr;
        let particleSystem = this.particleSystem;
        //alias
        let positionStartAttr = this.positionStartAttr;
        let velocityAttr = this.velocityAttr;
        let colorAttr = this.colorAttr;
        let turbulenceAttr = this.turbulenceAttr;
        let sizeAttr = this.sizeAttr;
        let lifeTimeAttr = this.lifeTimeAttr;
        let startTimeAttr = this.startTimeAttr;

        let i = this.particleCursor;
        // position
        positionStartAttr[i * 3 + 0] = position.x + (particleSystem.random() * positionRandomness);
        positionStartAttr[i * 3 + 1] = position.y + (particleSystem.random() * positionRandomness);
        positionStartAttr[i * 3 + 2] = position.z + (particleSystem.random() * positionRandomness);
        if (smoothPosition === true) {
            positionStartAttr[i * 3 + 0] += - (velocity.x * particleSystem.random());
            positionStartAttr[i * 3 + 1] += - (velocity.y * particleSystem.random());
            positionStartAttr[i * 3 + 2] += - (velocity.z * particleSystem.random());
        }
        // velocity
        let maxVel = 2;
        let velX = velocity.x + particleSystem.random() * velocityRandomness;
        let velY = velocity.y + particleSystem.random() * velocityRandomness;
        let velZ = velocity.z + particleSystem.random() * velocityRandomness;

        velX = clamp((velX - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);
        velY = clamp((velY - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);
        velZ = clamp((velZ - (- maxVel)) / (maxVel - (- maxVel)), 0, 1);

        velocityAttr[i * 3 + 0] = velX;
        velocityAttr[i * 3 + 1] = velY;
        velocityAttr[i * 3 + 2] = velZ;

        // color
        color.r = clamp(color.r + particleSystem.random() * colorRandomness, 0, 1);
        color.g = clamp(color.g + particleSystem.random() * colorRandomness, 0, 1);
        color.b = clamp(color.b + particleSystem.random() * colorRandomness, 0, 1);

        colorAttr[i * 3 + 0] = color.r;
        colorAttr[i * 3 + 1] = color.g;
        colorAttr[i * 3 + 2] = color.b;

        // turbulence, size, lifetime and starttime
        turbulenceAttr[i] = turbulence;
        sizeAttr[i] = size + particleSystem.random() * sizeRandomness;
        lifeTimeAttr[i] = lifetime;
        startTimeAttr[i] = this.time + particleSystem.random() * 2e-2;

        // offset
        if (this.offset === 0) {
            this.offset = this.particleCursor;
        }

        // counter and cursor
        this.count++;
        this.particleCursor++;

        if (this.particleCursor >= this.particleCount) {
            this.particleCursor = 0;
        }
        this.particleUpdate = true;
    }
   
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}