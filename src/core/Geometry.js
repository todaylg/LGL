import { Vec3 } from "../math/Vec3.js";

const tempVec3 = new Vec3();

let ID = 1;
let ATTR_ID = 1;

/**
 * Create a geometry
 *
 * @class
 * @param {WebGLContext} gl
 * @param {Object} [attribute] -  The attribute of geometry parameters
 * @param {Array} [attribute.data] - Typed array eg UInt16Array for indices, Float32Array
 * @param {Number} [attribute.size=1]
 * @param {Boolean/Number} [attribute.instanced=null] - Boolean default null. can pass divisor amount
 * @param {GLenum} [attribute.type] - Default gl.UNSIGNED_SHORT for 'index', gl.FLOAT for others
 * @param {Boolean} [attribute.normalize=false] - Boolean default false
 *
 * @example
 * new Geometry(gl, {position: { size: 3, data: new Float32Array(data.position) });
 */
export class Geometry {
  constructor(gl, attributes = {}) {
    this.gl = gl;
    this.attributes = attributes;
    this.id = ID++;

    // Store one VAO per program
    this.VAOs = {};

    this.drawRange = { start: 0, count: 0 }; // start offset and total data count
    this.instancedCount = 0;

    // Unbind current VAO so that new buffers don't get added to active mesh
    this.gl.renderer.bindVertexArray(null);
    this.gl.renderer.currentGeometry = null;

    // Alias for state store to avoid redundant calls for global state
    this.glState = this.gl.renderer.state;
    // create the buffers
    for (let key in attributes) {
      this.addAttribute(key, attributes[key]);
    }
  }

  /**
   * Add attribute to geometry
   */
  addAttribute(key, attr) {
    this.attributes[key] = attr;
    // Set options
    attr.id = ATTR_ID++;
    attr.size = attr.size || 1;
    attr.type =
      attr.type ||
      (attr.data.constructor === Float32Array
        ? this.gl.FLOAT
        : attr.data.constructor === Uint16Array
        ? this.gl.UNSIGNED_SHORT
        : this.gl.UNSIGNED_INT); // Uint32Array
    attr.target =
      key === "index" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
    attr.normalize = attr.normalize || false;
    attr.buffer = this.gl.createBuffer(); // Vertex Buffer Objects(VBO)
    attr.count = attr.data.length / attr.size;
    attr.divisor = attr.instanced || 0;
    attr.dataMode = attr.dataMode || this.gl.STATIC_DRAW;
    attr.needsUpdate = false;

    // Push data to buffer
    this.updateAttribute(attr);

    // Update geometry counts. If indexed, ignore regular attributes
    if (attr.divisor) {
      this.isInstanced = true;
      if (
        this.instancedCount &&
        this.instancedCount !== attr.count * attr.divisor
      ) {
        console.warn(
          "geometry has multiple instanced buffers of different length"
        );
        return (this.instancedCount = Math.min(
          this.instancedCount,
          attr.count * attr.divisor
        ));
      }
      this.instancedCount = attr.count * attr.divisor;
    } else if (key === "index") {
      this.drawRange.count = attr.count;
    } else if (!this.attributes.index) {
      this.drawRange.count = Math.max(this.drawRange.count, attr.count);
    }
  }

  /**
   * Bind buffer and update attribute data to buffer
   */
  updateAttribute(attr) {
    // Already bound, prevent gl command
    if (this.glState.boundBuffer !== attr.id) {
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.glState.boundBuffer = attr.id;
    }
    this.gl.bufferData(attr.target, attr.data, attr.dataMode); //STATIC_DRAW、DYNAMIC_DRAW、STREAM_DRAW
    attr.needsUpdate = false;
  }

  /**
   * Set the attribute draw range count
   *
   * @param {Object} value - The value of index key
   */
  setIndex(value) {
    this.addAttribute("index", value);
  }

  /**
   * Set the attribute draw range start and count
   *
   * @param {Number} start - The start value
   * @param {Number} count - The count value
   */
  setDrawRange(start, count) {
    this.drawRange.start = start;
    this.drawRange.count = count;
  }

  /**
   * Set the instance count value
   *
   * @param {Number} value - The instance count value
   */
  setInstancedCount(value) {
    this.instancedCount = value;
  }

  /**
   * Create Vertex Array Object and bind program
   *
   * @param {Program} program - The program to bind new vao
   */
  createVAO(program) {
    // Cache the VAO
    this.VAOs[program.attributeOrder] = this.gl.renderer.createVertexArray();
    this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
    this.bindAttributes(program);
  }

  /**
   * Bind attribute to program
   *
   * @param {Program} program - The program to bind attribute
   */
  bindAttributes(program) {
    // Link all program attributes using gl.vertexAttribPointer
    program.attributeLocations.forEach((location, name) => {
      // If geometry missing a required shader attribute
      if (!this.attributes[name]) {
        console.warn(`active attribute ${name} not being supplied`);
        return;
      }
      const attr = this.attributes[name];
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.glState.boundBuffer = attr.id;
      this.gl.vertexAttribPointer(
        location,
        attr.size,
        attr.type,
        attr.normalize,
        0, // stride
        0 // offset
      );
      this.gl.enableVertexAttribArray(location);
      // For instanced attributes, divisor needs to be set.
      // For firefox, need to set back to 0 if non-instanced drawn after instanced. Else won't render
      this.gl.renderer.vertexAttribDivisor(location, attr.divisor);
    });
    // Bind indices if geometry indexed (VAO will save IBO state)
    if (this.attributes.index)
      this.gl.bindBuffer(
        this.gl.ELEMENT_ARRAY_BUFFER,
        this.attributes.index.buffer
      ); //Index Buffer Object(IBO)
  }

  /**
   * Draw the Geometry
   *
   * @param {Object} [options] -  The options of drawing parameters
   * @param {GLenum} [options.mode=gl.TRIANGLES] - A GLenum specifying the type primitive to render.
   * @param {Boolean} [options.geometryBound=false] -  Calculate geometry bounding or not
   */
  draw({ program, mode = this.gl.TRIANGLES }) {
    if (
      this.gl.renderer.currentGeometry !==
      `${this.id}_${program.attributeOrder}`
    ) {
      if (!this.VAOs[program.attributeOrder]) this.createVAO(program); // Create VAO on first draw.
      this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
      this.gl.renderer.currentGeometry = `${this.id}_${program.attributeOrder}`;
    }

    // Check if any attributes need updating
    program.attributeLocations.forEach((location, name) => {
      const attr = this.attributes[name];
      if (attr && attr.needsUpdate) {
        this.updateAttribute(attr);
      }
    });

    if (this.isInstanced) {
      if (this.attributes.index) {
        this.gl.renderer.drawElementsInstanced(
          mode,
          this.drawRange.count,
          this.attributes.index.type,
          this.drawRange.start,
          this.instancedCount
        );
      } else {
        this.gl.renderer.drawArraysInstanced(
          mode,
          this.drawRange.start,
          this.drawRange.count,
          this.instancedCount
        );
      }
    } else {
      if (this.attributes.index) {
        this.gl.drawElements(
          mode,
          this.drawRange.count,
          this.attributes.index.type,
          this.drawRange.start
        );
      } else {
        this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
      }
    }
  }

  /**
   * Calculate geometry bounding box
   *
   * @param {Array} -  The geometry position data
   */
  computeBoundingBox(array) {
    // Use position buffer if available
    if (!array && this.attributes.position)
      array = this.attributes.position.data;
    if (!array) console.warn("No position buffer found to compute bounds");

    if (!this.bounds) {
      this.bounds = {
        min: new Vec3(),
        max: new Vec3(),
        center: new Vec3(),
        scale: new Vec3(),
        radius: Infinity
      };
    }
    const min = this.bounds.min;
    const max = this.bounds.max;
    const center = this.bounds.center;
    const scale = this.bounds.scale;

    min.set(+Infinity);
    max.set(-Infinity);

    for (let i = 0, l = array.length; i < l; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];
      min.x = Math.min(x, min.x);
      min.y = Math.min(y, min.y);
      min.z = Math.min(z, min.z);
      max.x = Math.max(x, max.x);
      max.y = Math.max(y, max.y);
      max.z = Math.max(z, max.z);
    }
    scale.sub(max, min);
    center.add(min, max).divide(2);
  }

  /**
   * Calculate geometry bounding sphere
   *
   * @param {Array} -  The geometry position data
   */
  computeBoundingSphere(array) {
    // Use position buffer if available
    if (!array && this.attributes.position)
      array = this.attributes.position.data;
    if (!array) console.warn("No position buffer found to compute bounds");

    if (!this.bounds) this.computeBoundingBox(array);

    let maxRadiusSq = 0;
    for (let i = 0, l = array.length; i < l; i += 3) {
      tempVec3.fromArray(array, i);
      maxRadiusSq = Math.max(
        maxRadiusSq,
        this.bounds.center.squaredDistance(tempVec3)
      );
    }
    this.bounds.radius = Math.sqrt(maxRadiusSq);
  }

  /**
   * Remove geometry attributes
   */
  remove() {
    if (this.vao) this.gl.renderer.deleteVertexArray(this.vao);
    for (let key in this.attributes) {
      this.gl.deleteBuffer(this.attributes[key].buffer);
      delete this.attributes[key];
    }
  }
}
