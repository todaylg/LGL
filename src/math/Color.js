/** 
 * @class Color
 * @description Color Class
 * @param {Number} [r=0] The element of Color.r
 * @param {Number} [g=x] The element of Color.g
 * @param {Number} [b=x] The element of Color.b
 * @example
 * // create a new Three-Dimensional Vector
 * new Color();
 */
export class Color extends Array {
    constructor(r = 0, g = r, b = g) {
        if (typeof r === 'string') [r, g, b] = Color.hexToRGB(r);
        if (r > 1) {
            r /= 255;
            g /= 255;
            b /= 255;
        }
        super(r, g, b);
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
     * @param {Number/String/Array} r
     * @param {Number} g
     * @param {Number} b
     * @returns {Color} 
     */
    set(r, g, b) {
        if (typeof r === 'string') [r, g, b] = Color.hexToRGB(r);
        if (r.length) return this.copy(r);
        this[0] = r;
        this[1] = g;
        this[2] = b;
        return this;
    }
    /**
     * @function
     * @description copy a Color from Array
     * @param {Array} v
     * @returns {Color} 
     */
    copy(v) {
        this[0] = v[0];
        this[1] = v[1];
        this[2] = v[2];
        return this;
    }
    /**
     * @function
     * @description Conversion hex format to rgb format
     * @param {String} hexValue
     * @returns {Array} 
     * @example
     * const rgb = Color.hexToRGB('#FFF');
     */
    static hexToRGB(hex) {
        if (hex.length === 4) hex = hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!r) console.warn(`Unable to convert hex string ${hex} to rgb values`);
        return [
            parseInt(r[1], 16) / 255,
            parseInt(r[2], 16) / 255,
            parseInt(r[3], 16) / 255
        ];
    }
    /**
     * @function
     * @description Conversion rgb format to hex format
     * @param {Array} rgbValue
     * @returns {Array} 
     * @example
     * const hex = Color.rgbToHex([255,255,255]);
     */
    static rgbToHex(rgb) {
        if (!rgb.length || rgb.length != 3) console.error(`Unable to convert rgb array ${rgb} to hex value`);
        let resHexStr = '#';
        for (let index = 0; index < rgb.length; index++) {
            let hex = Number(rgb[index]).toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            resHexStr += hex;
        }
        return resHexStr;
    }
    /**
      * @function
      * @description  Conversion hsl format to rgb format
      * https://en.wikipedia.org/wiki/HSL_and_HSV.
      * @param {Number} h hue(色相)
      * @param {Number} s saturation(饱和度)
      * @param {Number} l lightness(亮度)
      * @returns {Array} 
      * 
      * @example
      * const rgb = Color.hslToRGB(0.1,0.2,0.3);
      */
    static hslToRGB(h, s, l) {
        let r, g, b;
        if (s == 0) {
            r = g = b = l; // achromatic
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
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [r, g, b];
    }
    /**
      * @function
      * @description  Conversion rgb format to hsl format
      * https://en.wikipedia.org/wiki/HSL_and_HSV.
      * @param {Number} r
      * @param {Number} g 
      * @param {Number} b
      * @returns {Array} 
      * 
      * @example
      * const rgb = Color.rgbToHsl(255,255,255);
      */
    static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [h, s, l];
    }
    /**
      * @function
      * @description  Conversion rgb format to hsv format
      * https://en.wikipedia.org/wiki/HSL_and_HSV
      * @param {Number} r
      * @param {Number} g 
      * @param {Number} b
      * @returns {Array} 
      */
    static rgbToHsv(r, g, b) {
        r = r / 255;
        g = g / 255;
        b = b / 255;
        let h, s, v;
        let min = Math.min(r, g, b);
        let max = v = Math.max(r, g, b);
        let l = (min + max) / 2;
        let difference = max - min;

        if (max == min) {
            h = 0;
        } else {
            switch (max) {
                case r:
                    h = (g - b) / difference + (g < b ? 6 : 0);
                    break;
                case g:
                    h = 2.0 + (b - r) / difference;
                    break;
                case b:
                    h = 4.0 + (r - g) / difference;
                    break;
            }
            h = Math.round(h * 60);
        }
        if (max == 0) {
            s = 0;
        } else {
            s = 1 - min / max;
        }
        s = Math.round(s * 100);
        v = Math.round(v * 100);
        return [h, s, v];
    }

    /**
     * @function
     * @description generate Color from Array
     * @param {Array} a
     * @param {Number} o index offset of a
     * @returns {Vec4} 
     */
    fromArray(a, o = 0) {
        this[0] = a[o];
        this[1] = a[o + 1];
        this[2] = a[o + 2];
        return this;
    }
}