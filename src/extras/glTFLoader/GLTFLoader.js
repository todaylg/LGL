import GLTFParser from './GLTFParser.js';
import { extractUrlBase, decodeText } from './Util.js';
/**
 * Loader of glTF format
 */
export class GLTFLoader {
    constructor(gl) {
        this.gl = gl;
    }
    async load(url, options = {}, onLoad, onError) {
        let resourcesPath = extractUrlBase(url);;
        const data = await (await fetch(url)).arrayBuffer();
        this.parse(data, resourcesPath, options, function (gltf) {
            onLoad(gltf);
        }, onError);
    }
    parse(data, path, options, onLoad, onError) {
        let content;
        if (typeof data === 'string') {
            content = data;
        } else {
            content = decodeText(new Uint8Array(data));
        }
        let json = JSON.parse(content);
        console.log("JSON.parse result: ", json);
        if (json.asset === undefined || json.asset.version[0] < 2) {
            if (onError) onError(new Error('Unsupported glTF versions < 2.0.'));
            return;
        }
        // Todo:Extension
        if (json.extensionsUsed) {
            console.error("No support extension now");
        }
        let parser = new GLTFParser(this.gl, json, { path, ...options });
        parser.parse((scene, scenes, cameras, animations, json) => {
            let glTF = {
                scene,
                scenes,
                cameras,
                animations,
                parser,
                json
            };
            onLoad(glTF);// CallBack
        }, onError);
    }
}