import { GLTFRegistry } from './glTFLoaderUtil.js';
export default class GLTFParser{
    constructor(json){
        this.json = json || {};
        // loader object cache
        this.cache = new GLTFRegistry();
    }
    parse(onLoad, onError){
        let json = this.json;
        //load data info
        this.getMultiDependencies([
            'scene',
            'camera'
        ]).then((dependencies) => {
            let scenes = dependencies.scenes || [];
            let scene = scenes[json.scene || 0];
            let animations = dependencies.animations || [];
            let cameras = dependencies.cameras || [];
            onLoad(scene, scenes, cameras, animations, json);//Push callback needed args
        }).catch(onError);
    }
    /**
	 * Requests all multiple dependencies of the specified types asynchronously, with caching.
	 * @param {Array<string>} types
	 * @return {Promise<Object<Array<Object>>>}
	 */
    getMultiDependencies(types) {
        let results = {};
        let pendings = [];
        for (let i = 0, il = types.length; i < il; i++) {
            let type = types[i];
            let value = this.getDependencies(type);
            value = value.then(function (key, value) {
                results[key] = value;
            }.bind(this, type + (type === 'mesh' ? 'es' : 's')));
            pendings.push(value);
        }
        return Promise.all(pendings).then(() => {
            return results;
        });
    }
    /**
	 * Requests all dependencies of the specified type asynchronously, with caching.
	 * @param {string} type
	 * @return {Promise<Array<Object>>}
	 */
    getDependencies(type) {
        let dependencies = this.cache.get(type);
        if (!dependencies) {
            let parser = this;
            let defs = this.json[type + (type === 'mesh' ? 'es' : 's')] || [];
            dependencies = Promise.all(defs.map(function (def, index) {
                return parser.getDependency(type, index);
            }));
            this.cache.add(type, dependencies);
        }
        return dependencies;
    }
    /**
	 * Requests the specified dependency asynchronously, with caching.
	 * @param {string} type
	 * @param {number} index
	 * @return {Promise<Object>}
	 */
    getDependency(type, index) {
        var cacheKey = type + ':' + index;
        var dependency = this.cache.get(cacheKey);
        if (!dependency) {
            switch (type) {
                case 'scene':
                    // dependency = this.loadScene(index);
                    dependency = 'getDependency scene'
                    break;
                case 'node':
                    dependency = this.loadNode(index);
                    break;
                case 'mesh':
                    dependency = this.loadMesh(index);
                    break;
                case 'accessor':
                    dependency = this.loadAccessor(index);
                    break;
                case 'bufferView':
                    dependency = this.loadBufferView(index);
                    break;
                case 'buffer':
                    dependency = this.loadBuffer(index);
                    break;
                case 'material':
                    dependency = this.loadMaterial(index);
                    break;
                case 'texture':
                    dependency = this.loadTexture(index);
                    break;
                case 'skin':
                    dependency = this.loadSkin(index);
                    break;
                case 'animation':
                    dependency = this.loadAnimation(index);
                    break;
                case 'camera':
                    //dependency = this.loadCamera(index);
                    dependency = 'getDependency camera'
                    break;
                default:
                    throw new Error('Unknown type: ' + type);
            }
            this.cache.add(cacheKey, dependency);
        }
        return dependency;
    }
};