import GLTFParser from './GLTFParser.js';
import { extractUrlBase, decodeText } from './Util.js';

export class GLTFLoader {
    constructor(gl) {
        this.gl = gl;
    }
    async load(url, options={}, onLoad, onError) {
        let resourcesPath = extractUrlBase(url);;
        //1.只要函数使用async/await,所有包含该函数的嵌套函数都得使用async/await. 
        //2.async函数返回的永远是一个promise,response被传入了promise
        const data = await (await fetch(url)).arrayBuffer();
        console.log("data", data);
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
        console.error("JSON.parse: ", json);
        if (json.asset === undefined || json.asset.version[0] < 2) {
            if (onError) onError(new Error('GLTFLoader: Unsupported glTF versions < 2.0.'));
            return;
        }
        let parser = new GLTFParser(this.gl, json, { path, ...options });
        parser.parse((scene, scenes, cameras, json) => {
            //Parse过后的glTF格式
            let glTF = {
                scene,
                scenes,
                cameras,
                parser,
                json
            };
            onLoad(glTF);//CallBack
        }, onError);
    }
}