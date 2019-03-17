import GLTFParser from './glTFParser.js';
import { extractUrlBase, decodeText } from './util.js';

export default class GLTFLoader {
    constructor(){}
    async load(url, onLoad, onError){
        let resourcesPath = extractUrlBase(url);;
        //1.只要函数使用async/await,所有包含该函数的嵌套函数都得使用async/await. 
        //2.async函数返回的永远是一个promise,response被传入了promise
        const data = await (await fetch(url)).arrayBuffer();
        console.log("data", data);
        this.parse(data, resourcesPath, function (gltf) {
			onLoad(gltf);
		}, onError);
    }
    parse(data, path, onLoad, onError){
        let content;
        if(typeof data === 'string'){
            content = data;
        }else{
            content = decodeText(new Uint8Array(data));
        }
        let json = JSON.parse(content);
        console.error( "JSON.parse: ", json);
        if (json.asset === undefined || json.asset.version[0] < 2) {
			if (onError) onError(new Error('GLTFLoader: Unsupported glTF versions < 2.0.'));
			return;
        }
        let parser = new GLTFParser(json, {path});
        parser.parse( (scene, scenes, cameras, animations, json) => {
            //Parse过后的glTF格式
			let glTF = {
				scene: scene,
				scenes: scenes,
				cameras: cameras,
				animations: animations,
				asset: json.asset,
				parser: parser,
				userData: {}
			};
			onLoad(glTF);//CallBack
		}, onError);
    }
}