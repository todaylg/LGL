/** 
 * @class Color
 * @description Color Class
 * @param {Array} [array=[0, 0, 0]] The element(rgb) of Color.
 * @example
 * // create a new Three-Dimensional Vector
 * new Color();
 */
export class Color extends Float32Array {
    constructor(array = [0, 0, 0]) {
        super(3);
        if (typeof array === 'string') array = Color.hexToRGB(array);
        this.set(...array);
        return this;
    }
    get r() {
        return this[0];
    }

    set r(v) {
        this[0] = v;
    }

    get g() {
        return this[1];
    }

    set g(v) {
        this[1] = v;
    }

    get b() {
        return this[2];
    }

    set b(v) {
        this[2] = v;
    }
    /**
     * @function
     * @description Set the components of Color to the given values
     * @param {Number} r
     * @param {Number} g
     * @param {Number} b
     * @returns {Color} out
     */
    set(r, g, b) {
        this[0] = r;
        this[1] = g;
        this[2] = b;
        return this;
    }
    /**
     * @function
     * @description Set the Color from  hex format
     * @param {Array} haxValue
     * @returns {Color} out
     */
    setHex(hex) {
        if (hex.length === 4) hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        this.r = r ? parseInt(r[1], 16) / 255 : 0;
        this.g = r ? parseInt(r[2], 16) / 255 : 0;
        this.b = r ? parseInt(r[3], 16) / 255 : 0;
        return this;
    }
    /**
      * @function
      * @description Set the Color from  hsl format
      * @param {Array} haxValue
      * @returns {Color} out
      */
    setHSL(h, s, l) {
        if (s == 0) {
            this.r = this.g = this.b = l; // achromatic
        } else {
            let hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }
            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            this.r = hue2rgb(p, q, h + 1 / 3);
            this.g = hue2rgb(p, q, h);
            this.b = hue2rgb(p, q, h - 1 / 3);
        }
        return this;
    }
}