// Based from ThreeJS' OrbitControls class, rewritten using es6 with some additions and subtractions.
// TODO: abstract event handlers so can be fed from other sources
// TODO: make scroll zoom more accurate than just >/< zero

import { Vec3 } from '../math/Vec3.js';
import { Vec2 } from '../math/Vec2.js';

const STATE = { NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, DOLLY_PAN: 3 };
const MOURSE_BTTON = { left: 0, middle: 1, right: 2 };

// Temp vec value
const tempVec3 = new Vec3();
const tempVec2a = new Vec2();
const tempVec2b = new Vec2();
// Record start value
const rotateStart = new Vec2();
const panStart = new Vec2();
const dollyStart = new Vec2();

function getZoomScale(zoomSpeed) {
    return Math.pow(0.95, zoomSpeed);
}
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
export class Orbit {
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
        const sphericalTarget = this.sphericalTarget = { radius: 1, phi: 0, theta: 0 };
        const spherical = this.spherical = { radius: 1, phi: 0, theta: 0 };
        this.sphericalDelta = { radius: 1, phi: 0, theta: 0 };
        this.panDelta = new Vec3();

        // Grab initial position values
        const offset = this.offset = new Vec3();
        offset.copy(camera.position).sub(this.target);
        // Spherical coordinate system (world is "y-axis-is-up" space)
        spherical.radius = sphericalTarget.radius = offset.distance();
        // Azimuth angle
        spherical.theta = sphericalTarget.theta = Math.atan2(offset.x, offset.z); //(y,x) => y/x
        // Polar angle
        spherical.phi = sphericalTarget.phi = Math.acos(Math.min(Math.max(offset.y / sphericalTarget.radius, -1), 1));

        this.addHandlers();
    }
    /**
    * Update the camera value
    */
    update() {
        const {
            sphericalTarget,
            sphericalDelta,
            minAzimuthAngle,
            maxAzimuthAngle,
            minPolarAngle,
            maxPolarAngle,
            minDistance,
            maxDistance,
            spherical,
            ease,
            target,
            panDelta,
            offset,
            camera,
            inertia,
        } = this;
        // apply delta
        sphericalTarget.radius *= sphericalDelta.radius;
        sphericalTarget.theta += sphericalDelta.theta;
        sphericalTarget.phi += sphericalDelta.phi;

        // apply boundaries
        sphericalTarget.theta = Math.max(minAzimuthAngle, Math.min(maxAzimuthAngle, sphericalTarget.theta));
        sphericalTarget.phi = Math.max(minPolarAngle, Math.min(maxPolarAngle, sphericalTarget.phi));
        sphericalTarget.radius = Math.max(minDistance, Math.min(maxDistance, sphericalTarget.radius));

        // ease values
        spherical.phi += (sphericalTarget.phi - spherical.phi) * ease;
        spherical.theta += (sphericalTarget.theta - spherical.theta) * ease;
        spherical.radius += (sphericalTarget.radius - spherical.radius) * ease;

        // apply pan to target. As offset is relative to target, it also shifts
        target.add(panDelta);

        // apply rotation to offset
        let sinPhiRadius = spherical.radius * Math.sin(Math.max(0.000001, spherical.phi));
        offset.x = sinPhiRadius * Math.sin(spherical.theta);
        offset.y = spherical.radius * Math.cos(spherical.phi);
        offset.z = sinPhiRadius * Math.cos(spherical.theta);

        // Apply updated values to object
        camera.position.copy(target).add(offset);
        camera.lookAt(target);

        // Apply inertia to values
        sphericalDelta.theta *= inertia;
        sphericalDelta.phi *= inertia;
        panDelta.multiply(inertia);

        // Reset scale every frame to avoid applying scale multiple times
        sphericalDelta.radius = 1;
    }
    /**
    * Add event handlers 
    * every event handler just for updating panDelta and sphericalDelta
    * the orbit is enough to calculating with this two value
    */
    addHandlers() {
        const { element } = this;
        element.addEventListener('contextmenu', this.onContextMenu.bind(this), false);
        element.addEventListener('mousedown', this.onMouseDown.bind(this), false);
        window.addEventListener('wheel', this.onMouseWheel.bind(this), false);
        element.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        element.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        element.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
    }

    /**
    * Right click event handler
    */
    onContextMenu(e) {
        if (!this.enabled) return;
        e.preventDefault();
    }

    /**
    * Mouse down event handler
    */
    onMouseDown(e) {
        if (!this.enabled) return;
        switch (e.button) {
            // Left click
            case MOURSE_BTTON.left:
                if (this.enableRotate === false) return;
                rotateStart.set(e.clientX, e.clientY);
                this.state = STATE.ROTATE;
                break;
            // Middle scroll
            case MOURSE_BTTON.middle:
                if (this.enableZoom === false) return;
                dollyStart.set(e.clientX, e.clientY);
                this.state = STATE.DOLLY;
                break;
            // Right click
            case MOURSE_BTTON.right:
                if (this.enablePan === false) return;
                panStart.set(e.clientX, e.clientY);
                this.state = STATE.PAN;
                break;
        }
        if (this.state !== STATE.NONE) {
            // Begin listen mousemove and up event
            window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
            window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        }
    }

    /**
    * Mouse move event handler
    */
    onMouseMove(e) {
        if (!this.enabled) return;
        switch (this.state) {
            case STATE.ROTATE:
                if (this.enableRotate === false) return;
                this.handleMoveRotate(e.clientX, e.clientY);
                break;
            case STATE.DOLLY:
                if (this.enableZoom === false) return;
                this.handleMouseMoveDolly(e);
                break;
            case STATE.PAN:
                if (this.enablePan === false) return;
                this.handleMovePan(e.clientX, e.clientY);
                break;
        }
    }

    /**
    * Mouse up event handler
    */
    onMouseUp() {
        if (!this.enabled) return;
        document.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
        document.removeEventListener('mouseup', this.onMouseUp.bind(this), false);
        this.state = STATE.NONE;
    }

    /**
    * Handle left click + mouse move event
    */
    handleMoveRotate(x, y) {
        tempVec2a.set(x, y);
        tempVec2b.sub(tempVec2a, rotateStart).multiply(this.rotateSpeed);
        let el = this.element === document ? document.body : this.element;
        this.sphericalDelta.theta -= 2 * Math.PI * tempVec2b.x / el.clientHeight;
        this.sphericalDelta.phi -= 2 * Math.PI * tempVec2b.y / el.clientHeight;
        rotateStart.copy(tempVec2a);
    }

    /**
    * Handle midlle click + mouse move event
    */
    handleMouseMoveDolly(e) {
        tempVec2a.set(e.clientX, e.clientY);
        tempVec2b.sub(tempVec2a, dollyStart);
        if (tempVec2b.y > 0) { // Up scroll
            this.dolly(getZoomScale(this.zoomSpeed));
        } else if (tempVec2b.y < 0) { // Dwon scroll
            this.dolly(1 / getZoomScale(this.zoomSpeed));
        }
        dollyStart.copy(tempVec2a);
    }
    dolly(dollyScale) {
        this.sphericalDelta.radius /= dollyScale;
    }

    /**
    * Handle right click + mouse move event
    */
    handleMovePan(x, y) {
        tempVec2a.set(x, y);
        tempVec2b.sub(tempVec2a, panStart).multiply(this.panSpeed);
        this.pan(tempVec2b.x, tempVec2b.y);
        panStart.copy(tempVec2a);
    }
    pan(deltaX, deltaY) {
        let { element, camera } = this;
        let el = element === document ? document.body : element;
        tempVec3.copy(camera.position).sub(this.target);
        let targetDistance = tempVec3.distance();
        targetDistance *= Math.tan(((camera.fov || 45) / 2) * Math.PI / 180.0);
        this.panLeft(2 * deltaX * targetDistance / el.clientHeight, camera.matrix);
        this.panUp(2 * deltaY * targetDistance / el.clientHeight, camera.matrix);
    };
    panLeft(distance, m) {
        tempVec3.set(m[0], m[1], m[2]);
        tempVec3.multiply(-distance);
        this.panDelta.add(tempVec3);
    }
    panUp(distance, m) {
        tempVec3.set(m[4], m[5], m[6]);
        tempVec3.multiply(distance);
        this.panDelta.add(tempVec3);
    }

    /**
    * Handle mourse wheel event
    */
    onMouseWheel(e) {
        const { enabled, enableZoom, state } = this;
        if (!enabled || !enableZoom || (state !== STATE.NONE && state !== STATE.ROTATE)) return;
        e.preventDefault();//Warning passive
        e.stopPropagation();

        if (e.deltaY < 0) {
            this.dolly(1 / getZoomScale(this.zoomSpeed));
        } else if (e.deltaY > 0) {
            this.dolly(getZoomScale(this.zoomSpeed));
        }
    }

    /**
    * Handle mobile touch start event
    */
    onTouchStart(e){
        if (!this.enabled) return;
        e.preventDefault();
        switch (e.touches.length) {
            case 1:
                if (this.enableRotate === false) return;
                rotateStart.set(e.touches[0].pageX, e.touches[0].pageY);
                this.state = STATE.ROTATE;
                break;
            case 2:
                if (this.enableZoom === false && this.enablePan === false) return;
                this.handleTouchStartDollyPan(e);
                this.state = STATE.DOLLY_PAN;
                break;
            default:
                this.state = STATE.NONE;
        }
    }

    /**
    * Deal mobile touch start dolly and pan
    */
    handleTouchStartDollyPan(e) {
        if (this.enableZoom) {
            let dx = e.touches[0].pageX - e.touches[1].pageX;
            let dy = e.touches[0].pageY - e.touches[1].pageY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            dollyStart.set(0, distance);
        }

        if (this.enablePan) {
            let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
            let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
            panStart.set(x, y);
        }
    }

    /**
    * Deal mobile touch move dolly and pan
    */
    handleTouchMoveDollyPan(e) {
        if (this.enableZoom) {
            let dx = e.touches[0].pageX - e.touches[1].pageX;
            let dy = e.touches[0].pageY - e.touches[1].pageY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            tempVec2a.set(0, distance);
            tempVec2b.set(0, Math.pow(tempVec2a.y / dollyStart.y, this.zoomSpeed));
            this.dolly(tempVec2b.y);
            dollyStart.copy(tempVec2a);
        }

        if (this.enablePan) {
            let x = 0.5 * (e.touches[0].pageX + e.touches[1].pageX);
            let y = 0.5 * (e.touches[0].pageY + e.touches[1].pageY);
            this.handleMovePan(x, y);
        }
    }

    /**
    * Handle mobile touch move event
    */
    onTouchMove(e) {
        if (!this.enabled) return;
        e.preventDefault();
        e.stopPropagation();

        switch (e.touches.length) {
            case 1:
                if (this.enableRotate === false) return;
                this.handleMoveRotate(e.touches[0].pageX, e.touches[0].pageY);
                break;
            case 2:
                if (this.enableZoom === false && this.enablePan === false) return;
                this.handleTouchMoveDollyPan(e);
                break;
            default:
                this.state = STATE.NONE;
        }
    }

    /**
   * Handle mobile touch end event
   */
    onTouchEnd() {
        if (!this.enabled) return;
        this.state = STATE.NONE;
    };

    /**
    * Remove event handlers
    */
    removeHandler() {
        element.removeEventListener('contextmenu', this.onContextMenu, false);
        element.removeEventListener('mousedown', this.onMouseDown, false);
        window.removeEventListener('wheel', this.onMouseWheel, false);
        element.removeEventListener('touchstart', this.onTouchStart, false);
        element.removeEventListener('touchend', this.onTouchEnd, false);
        element.removeEventListener('touchmove', this.onTouchMove, false);
        window.removeEventListener('mousemove', this.onMouseMove, false);
        window.removeEventListener('mouseup', this.onMouseUp, false);
    }
}

