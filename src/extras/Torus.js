import { Geometry } from '../core/Geometry.js';
import { Vec3 } from '../math/Vec3.js';

/**
 * Create a Torus Geometry
 * 
 * @class
 * @extends Geometry
 * @param {WebGLContext} gl
 * @param {Object} [options] -  The optional torus parameters
 * @param {Number} [options.radius=1] - Radius of the torus, from the center of the torus to the center of the tube
 * @param {Number} [options.tube=0.4] - Radius of the tube
 * @param {Number} [options.radialSegments=8]
 * @param {Object} [options.tubularSegments=6]
 * @param {Object} [options.arc=Math.PI*2] - Central angle
 * @param {Object} [options.attributes={}] - The other Geometry attribute of torus
 */
export class Torus extends Geometry {
    constructor(gl, {
        radius = 1,
        tube = 0.4,
        radialSegments = 8,
        tubularSegments = 6,
        arc = Math.PI * 2,
        attributes = {},
    } = {}) {
        const num = (radialSegments + 1) * (tubularSegments + 1);
        const numIndices = radialSegments * tubularSegments * 6;

        const position = new Float32Array(num * 3);
        const normal = new Float32Array(num * 3);
        const uv = new Float32Array(num * 2);
        const index = new Uint16Array(numIndices);

        let center = new Vec3();
        let vertex = new Vec3();

        let i = 0;
        let ii = 0;
        let n = new Vec3();
        // generate vertices, normals and uvs
        for (let iy = 0; iy <= radialSegments; iy++) {
            for (let ix = 0; ix <= tubularSegments; ix++ , i++) {
                let u = ix / tubularSegments * arc;
                let v = iy / radialSegments * Math.PI * 2;

                let x = (radius + tube * Math.cos(v)) * Math.cos(u);
                let y = (radius + tube * Math.cos(v)) * Math.sin(u);
                let z = tube * Math.sin(v);

                // vertex
                position[i * 3] = vertex.x = x;
                position[i * 3 + 1] = vertex.y = y;
                position[i * 3 + 2] = vertex.z = z;

                // normal
                center.x = radius * Math.cos(u);
                center.y = radius * Math.sin(u);
                n.sub(vertex, center).normalize();
                normal[i * 3] = n.x;
                normal[i * 3 + 1] = n.y;
                normal[i * 3 + 2] = n.z;

                // uv
                uv[i * 2] = ix / tubularSegments;
                uv[i * 2 + 1] = iy / radialSegments;
            }
        }

        // generate indices
        for (let iy = 1; iy <= radialSegments; iy++) {
            for (let ix = 1; ix <= tubularSegments; ix++) {
                // indices
                let a = (tubularSegments + 1) * iy + ix - 1;
                let b = (tubularSegments + 1) * (iy - 1) + ix - 1;
                let c = (tubularSegments + 1) * (iy - 1) + ix;
                let d = (tubularSegments + 1) * iy + ix;
                // faces
                index[ii * 6] = a;
                index[ii * 6 + 1] = b;
                index[ii * 6 + 2] = d;

                index[ii * 6 + 3] = b;
                index[ii * 6 + 4] = c;
                index[ii * 6 + 5] = d;
                ii++;
            }
        }

        Object.assign(attributes, {
            position: { size: 3, data: position },
            normal: { size: 3, data: normal },
            uv: { size: 2, data: uv },
            index: { data: index },
        });

        super(gl, attributes);
    }
}