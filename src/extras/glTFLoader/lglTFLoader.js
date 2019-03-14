import {
	EXTENSIONS,
	BINARY_EXTENSION_BUFFER_NAME,
	BINARY_EXTENSION_HEADER_MAGIC,
	BINARY_EXTENSION_HEADER_LENGTH,
	BINARY_EXTENSION_CHUNK_TYPES,
	GLTFBinaryExtension,
	extractUrlBase,
	decodeText,
	addUnknownExtensionsToUserData,
} from './glTFLoaderUtil.js';
import GLTFParser from './glTFParser.js';

export default class GLTFLoader {
	constructor() { }
	async load(url, onLoad, onError) {
		let resourcePath;
		if (this.resourcePath !== undefined) {
			resourcePath = this.resourcePath;
		} else {
			resourcePath = extractUrlBase(url);
		}
		//FileLoader(ajax) => fetch
		const data = await (await fetch(url)).arrayBuffer();
		// Parser
		this.parse(data, resourcePath, function (gltf) {
			onLoad(gltf);
		}, onError);
	}
	//parse arraybuffer string 
	parse(data, path, onLoad, onError) {
		let content;
		let extensions = {};
		if (typeof data === 'string') {
			content = data;
		} else {
			let magic = decodeText(new Uint8Array(data, 0, 4));
			if (magic === BINARY_EXTENSION_HEADER_MAGIC) {
				try {
					extensions[EXTENSIONS.KHR_BINARY_GLTF] = new GLTFBinaryExtension(data);
				} catch (error) {
					if (onError) onError(error);
					return;
				}
				content = extensions[EXTENSIONS.KHR_BINARY_GLTF].content;
			} else {
				content = decodeText(new Uint8Array(data));
			}
		}
		//glTF is a Json File
		let json = JSON.parse(content);
		console.error( "JSON.parse: ", json);
		if (json.asset === undefined || json.asset.version[0] < 2) {
			if (onError) onError(new Error('GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported.'));
			return;
		}
		//extension
		if (json.extensionsUsed) {
			for (var i = 0; i < json.extensionsUsed.length; ++i) {
				var extensionName = json.extensionsUsed[i] || json.extensionsRequired;
				switch (extensionName) {
					default:
					console.warn('GLTFLoader: no support extension "' + extensionName + '".');
				}
			}
		}

		let parser = new GLTFParser(json, extensions);

		parser.parse(function (scene, scenes, cameras, animations, json) {
			let glTF = {
				scene: scene,
				scenes: scenes,
				cameras: cameras,
				animations: animations,
				asset: json.asset,
				parser: parser,
				userData: {}
			};
			addUnknownExtensionsToUserData(extensions, glTF, json);
			onLoad(glTF);//CallBack
		}, onError);
	}
}
