// Based from ThreeJS' OrbitControls class, rewritten using es6 with some additions and subtractions.
// TODO: abstract event handlers so can be fed from other sources
// TODO: make scroll zoom more accurate than just >/< zero

import { Vec3 } from '../math/Vec3.js';
import { Vec2 } from '../math/Vec2.js';

const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, DOLLY_PAN: 3 };
const tempVec3 = new Vec3();
const tempVec2a = new Vec2();
const tempVec2b = new Vec2();
/**
 * Orbit controls allow the camera to orbit around a target
 * 
 * @class
 * @param {Camera} camera - The camera to be controlled
 * @param {Object} [options] -  The optional orbit parameters
 * @param {HTMLElement} [options.element=document] - The HTML element used for event listeners
 * @param {Boolean} [options.enabled=true]
 * @param {Vec3} [options.target=new Vec3()]
 * @param {Number} [options.ease=0.25]
 * @param {Number} [options.inertia=0.85]
 * @param {Boolean} [options.enableRotate=true]
 * @param {Number} [options.rotateSpeed=0.1]
 * @param {Boolean} [options.enableZoom=true]
 * @param {Number} [options.zoomSpeed=1]
 * @param {Boolean} [options.enablePan=true]
 * @param {Number} [options.panSpeed=0.1]
 * @param {Number} [options.minPolarAngle=0]
 * @param {Number} [options.maxPolarAngle=Math.PI]
 * @param {Number} [options.minAzimuthAngle=-Infinity]
 * @param {Number} [options.maxAzimuthAngle=Infinity]
 * @param {Number} [options.minDistance=0]
 * @param {Number} [options.maxDistance=Infinity]
 */
class Orbit {
    constructor(camera, {
        element = document,
        enabled = true,
        target = new Vec3(),
        ease = 0.25,
        inertia = 0.85,
        enableRotate = true,
        rotateSpeed = 0.1,
        enableZoom = true,
        zoomSpeed = 1,
        enablePan = true,
        panSpeed = 0.1,
        minPolarAngle = 0,
        maxPolarAngle = Math.PI,
        minAzimuthAngle = -Infinity,
        maxAzimuthAngle = Infinity,
        minDistance = 0,
        maxDistance = Infinity,
    } = {}) {
        this.camera = camera;
        this.element = element;
        this.enabled = enabled;
        this.target = target;
        this.ease = ease || 1; // 1 so has no effect
        this.inertia = inertia || 1; // 1 so has no effect
        this.enableRotate = enableRotate;
        this.rotateSpeed = rotateSpeed;
        this.enableZoom = enableZoom;
        this.zoomSpeed = zoomSpeed;
        this.enablePan = enablePan;
        this.panSpeed = panSpeed;
        this.minPolarAngle = minPolarAngle;
        this.maxPolarAngle = maxPolarAngle;
        this.minAzimuthAngle = minAzimuthAngle;
        this.maxAzimuthAngle = maxAzimuthAngle;
        this.minDistance = minDistance;
        this.maxDistance = maxDistance;

        // current position in sphericalTarget coordinates
        this.sphericalDelta = { radius: 1, phi: 0, theta: 0 };
        const sphericalTarget = this.sphericalTarget = { radius: 1, phi: 0, theta: 0 };
        const spherical = this.spherical = { radius: 1, phi: 0, theta: 0 };
        this.panDelta = new Vec3();

        // Grab initial position values
        const offset = this.offset = new Vec3();
        offset.copy(camera.position).sub(this.target);
        spherical.radius = sphericalTarget.radius = offset.distance();
        spherical.theta = sphericalTarget.theta = Math.atan2(offset.x, offset.z);
        spherical.phi = sphericalTarget.phi = Math.acos(Math.min(Math.max(offset.y / sphericalTarget.radius, -1), 1));
    }
    update() {

    }
}

