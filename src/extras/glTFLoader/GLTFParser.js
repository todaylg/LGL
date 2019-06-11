import { Transform, Mat4, Camera, Color, Program, Geometry, Texture, Mesh, Vec4, Vec2 } from '../../Core.js';
import { Skin } from '../Skin.js';
import { GLTFRegistry, resolveURL, definesToString, sliceBlockData, isPrimitiveEqual } from './Util.js';
import { WEBGL_TYPE_SIZES, WEBGL_COMPONENT_TYPES, ALPHA_MODES, ATTRIBUTES, WEBGL_CONSTANTS, BRDF_LUT_URL } from './Const.js';
import { BufferAttribute } from './bufferHandler/BufferAttribute.js';
import PBRBaseShader from './shaders/PBRBaseShader.js';
import { AnimationSystem, AnimationChannel, Animation } from '../Animation.js';

export default class GLTFParser {
    constructor(gl, json, options = {}) {
        this.gl = gl;
        this.json = json || {};
        this.path = options.path || '';
        this.useIBL = options.useIBL == undefined ? false : options.useIBL;
        this.envDiffuseCubeMapSrc = options.envDiffuseCubeMapSrc;
        this.envSpecularCubeMapSrc = options.envSpecularCubeMapSrc;
        this.glExtension = options.glExtension || {};
        this.defaultShader;
        this.animationSys = json.animations ? new AnimationSystem() : null;
        // Cache
        this.cache = new GLTFRegistry();
        this.primitiveCache = [];
    }
    parse(onLoad, onError) {
        let json = this.json;
        let parser = this;
        // Clear the loader cache
        this.cache.removeAll();
        // Mark the special nodes/meshes in json for efficient parse
        this.markDefs();
        // Load data info
        this.getMultiDependencies([
            'scene',
            'camera',
            'animation'
        ]).then((dependencies) => {
            let scenes = dependencies.scenes || [];
            let scene = scenes[json.scene || 0];
            let animations = parser.animationSys;
            let cameras = dependencies.cameras || [];
            onLoad(scene, scenes, cameras, animations, json);// Push callback needed args
        }).catch(onError);
    }
    /**
	 * Marks the special nodes/meshes in json for efficient parse.
	 */
    markDefs() {
        let nodeDefs = this.json.nodes || [];
        let skinDefs = this.json.skins || [];
        let meshDefs = this.json.meshes || [];
        // Mark bones.
        for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
            let joints = skinDefs[skinIndex].joints;
            for (let i = 0, il = joints.length; i < il; i++) {
                nodeDefs[joints[i]].isBone = true;
            }
        }
        for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
            let nodeDef = nodeDefs[nodeIndex];
            if (nodeDef.mesh !== undefined) {
                // Mark SkinnedMesh if node has skin.
                if (nodeDef.skin !== undefined) {
                    meshDefs[nodeDef.mesh].isSkinnedMesh = true;
                }
            }
        }
    }
    /**
	 * Requests all multiple dependencies of the specified types asynchronously
	 * @param {Array<string>} types
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
	 * Requests all dependencies of the specified type asynchronously
	 * @param {string} type
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
	 * Requests the specified dependency asynchronously
	 * @param {string} type
	 * @param {number} index
	 */
    getDependency(type, index) {
        let cacheKey = type + ':' + index;
        let dependency = this.cache.get(cacheKey);
        let res = this.cache.getAll();
        if (!dependency) {
            switch (type) {
                case 'scene':
                    dependency = this.loadScene(index);
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
                    dependency = this.loadCamera(index);
                    break;
                default:
                    throw new Error('Unknown type: ' + type);
            }
            this.cache.add(cacheKey, dependency);
        }
        return dependency;
    }
    /**
     * Scene node hierachy builder
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
	 * @param {number} sceneIndex
	 */
    loadScene(sceneIndex) {
        let json = this.json;
        let sceneDef = this.json.scenes[sceneIndex];
        return this.getMultiDependencies([
            'node',
            'skin',
        ]).then(function (dependencies) {
            console.log('dependencies: ', dependencies);
            let scene = new Transform();
            if (sceneDef.name !== undefined) scene.name = sceneDef.name;
            let nodeIds = sceneDef.nodes || [];
            for (let i = 0, il = nodeIds.length; i < il; i++) {
                buildNodeHierachy(nodeIds[i], scene, json, dependencies.nodes, dependencies.skins);
            }
            return scene;
        });
        function buildNodeHierachy(nodeId, parentObject, json, allNodes, skins) {
            let node = allNodes[nodeId];
            let nodeDef = json.nodes[nodeId];
            // build node hierachy
            if (nodeDef.skin !== undefined) {
                let meshes = node.children.length ? node.children : [node];
                for (let i = 0, il = meshes.length; i < il; i++) {
                    let mesh = meshes[i];
                    let skinEntry = skins[nodeDef.skin];
                    let bones = [];
                    let boneInverses = [];
                    for (let j = 0, jl = skinEntry.joints.length; j < jl; j++) {
                        let jointId = skinEntry.joints[j];
                        let jointNode = allNodes[jointId];
                        if (jointNode) {
                            bones.push(jointNode);
                            let mat = new Mat4();
                            if (skinEntry.inverseBindMatrices !== undefined) {
                                mat.fromArray(skinEntry.inverseBindMatrices.data, j * 16);
                            }
                            boneInverses.push(mat);
                        } else {
                            console.warn('Could not found jointNode', jointId);
                        }
                    }
                    mesh.init({
                        bones,
                        boneInverses
                    });
                }
            }

            parentObject.addChild(node);
            if (nodeDef.children) {
                let children = nodeDef.children;
                for (let i = 0, il = children.length; i < il; i++) {
                    let child = children[i];
                    buildNodeHierachy(child, node, json, allNodes, skins);
                }
            }
        }
    }
    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
	 * @param {number} nodeIndex
	 */
    loadNode(nodeIndex) {
        let json = this.json;
        let nodeDef = json.nodes[nodeIndex];
        return this.getMultiDependencies([
            'mesh',
            'skin',
            'camera',
        ]).then(function (dependencies) {
            let node;
            if (nodeDef.isBone === true) {
                node = new Transform();
                node.isBone = true; // Mark this is a bone node
            } else if (nodeDef.mesh !== undefined) {
                let mesh = dependencies.meshes[nodeDef.mesh];
                node = mesh;
            } else if (nodeDef.camera !== undefined) {
                node = dependencies.cameras[nodeDef.camera];
            } else {
                node = new Transform();
            }
            if (nodeDef.name !== undefined) {
                node.name = nodeDef.name;
            }
            if (nodeDef.matrix !== undefined) {
                let matrix = new Mat4();
                matrix.fromArray(nodeDef.matrix);
                node.applyMatrix(matrix);
            } else {
                if (nodeDef.translation !== undefined) {
                    node.position.fromArray(nodeDef.translation);
                }
                if (nodeDef.rotation !== undefined) {
                    node.quaternion.fromArray(nodeDef.rotation);
                }
                if (nodeDef.scale !== undefined) {
                    node.scale.fromArray(nodeDef.scale);
                }
            }
            return node;
        });
    };
    /**
    * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
    * @param {number} meshIndex
    */
    loadMesh(meshIndex) {
        let parser = this;
        let json = this.json;
        let meshDef = json.meshes[meshIndex];
        return this.getMultiDependencies([
            'accessor',
            'material'
        ]).then(function (dependencies) {
            let primitives = meshDef.primitives;
            let originalMaterials = [];
            // Check every material
            for (let i = 0, il = primitives.length; i < il; i++) {
                originalMaterials[i] = primitives[i].material === undefined
                    ? {} // Use default material
                    : dependencies.materials[primitives[i].material];
            }
            return parser.loadGeometries(primitives).then(function (geometries) {
                let meshes = [];
                for (let i = 0, il = geometries.length; i < il; i++) {
                    let geometry = geometries[i];
                    let primitive = primitives[i];
                    // Create Mesh
                    let mesh;
                    let materialParams = originalMaterials[i];
                    let fragDefines = materialParams.glTFLoaderDefines || {};
                    let vexDefines = geometry.glTFLoaderDefines || {};
                    let defines = Object.assign({}, fragDefines, vexDefines);
                    let shaderDefines = '#version 300 es\n' + definesToString(defines);
                    if (parser.useIBL) {
                        shaderDefines += '#define USE_IBL 1\n';
                    }
                    if (parser.glExtension.hasSRGBExt) {
                        shaderDefines += '#define MANUAL_SRGB 1\n';
                    }
                    if (parser.glExtension.hasLODExtension) {
                        shaderDefines += '#define USE_TEX_LOD 1\n';
                    }
                    if (meshDef.isSkinnedMesh) {
                        shaderDefines += '#define USE_SKINNING 1\n';
                    }
                    materialParams.uniforms.TAR_WEIGHT = {
                        value: meshDef.weights ? new Vec2().fromArray(meshDef.weights) : new Vec2(0)
                    }
                    let program = new Program(parser.gl, {
                        vertex: shaderDefines + PBRBaseShader.vertex,
                        fragment: shaderDefines + PBRBaseShader.fragment,
                        uniforms: materialParams.uniforms,
                        ...materialParams.options
                    })
                    if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
                        primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
                        primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
                        primitive.mode === undefined) {
                        mesh = meshDef.isSkinnedMesh === true
                            ? new Skin(parser.gl, { geometry, program })
                            : new Mesh(parser.gl, { geometry, program });
                        if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
                            mesh.mode = parser.gl.TRIANGLE_STRIP;
                        } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
                            mesh.mode = parser.gl.TRIANGLE_FAN;
                        }
                    } else {
                        throw new Error('Primitive mode unsupported: ' + primitive.mode);
                    }
                    mesh.name = meshDef.name || ('mesh_' + meshIndex);
                    if (geometries.length > 1) mesh.name += '_' + i;
                    meshes.push(mesh);
                }
                if (meshes.length === 1) {
                    return meshes[0];
                }
                let group = new Transform();
                for (let i = 0, il = meshes.length; i < il; i++) {
                    group.add(meshes[i]);
                }
                return group;
            });
        });
    };
    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	 * @param {number} accessorIndex
	 */
    loadAccessor(accessorIndex) {
        let json = this.json;
        let accessorDef = json.accessors[accessorIndex];
        if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {
            // Ignore empty accessors, which may be used to declare runtime
            return null;
        }
        let pendingBufferViews = [];
        if (accessorDef.bufferView !== undefined) {
            pendingBufferViews.push(this.getDependency('bufferView', accessorDef.bufferView));
        } else {
            pendingBufferViews.push(null);
        }
        if (accessorDef.sparse !== undefined) {
            pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.indices.bufferView));
            pendingBufferViews.push(this.getDependency('bufferView', accessorDef.sparse.values.bufferView));
        }
        return Promise.all(pendingBufferViews).then(function (bufferViews) {
            let bufferView = bufferViews[0];
            let itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
            let TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
            // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
            let elementBytes = TypedArray.BYTES_PER_ELEMENT;
            let itemBytes = elementBytes * itemSize;
            let byteOffset = accessorDef.byteOffset || 0;
            let byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[accessorDef.bufferView].byteStride : undefined;
            let normalized = accessorDef.normalized === true;
            let array, bufferAttribute;
            // The buffer is not interleaved if the stride is the item size in bytes.
            if (byteStride && byteStride !== itemBytes) {
                // Todo: InterleavedBuffer
                console.err("InterleavedBuffer no supported yet");
            } else {
                if (bufferView === null) {
                    array = new TypedArray(accessorDef.count * itemSize);
                } else {
                    array = new TypedArray(bufferView, byteOffset, accessorDef.count * itemSize);
                }
                bufferAttribute = new BufferAttribute(array, itemSize, normalized);
            }
            // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
            if (accessorDef.sparse !== undefined) {
                let itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
                let TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
                let byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
                let byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
                let sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
                let sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
                if (bufferView !== null) {
                    // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
                    bufferAttribute.setArray(bufferAttribute.array.slice());
                }
                for (let i = 0, il = sparseIndices.length; i < il; i++) {
                    let index = sparseIndices[i];
                    bufferAttribute.setX(index, sparseValues[i * itemSize]);
                    if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
                    if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
                    if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
                    if (itemSize >= 5) throw new Error('Unsupported itemSize in sparse BufferAttribute');
                }
            }
            return bufferAttribute;
        });
    }
    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferViewIndex
	 * @return {Promise<ArrayBuffer>}
     * Dependencies: buffer
	 */
    loadBufferView(bufferViewIndex) {
        let bufferViewDef = this.json.bufferViews[bufferViewIndex];
        return this.getDependency('buffer', bufferViewDef.buffer).then(function (buffer) {
            let byteLength = bufferViewDef.byteLength || 0;
            let byteOffset = bufferViewDef.byteOffset || 0;
            return buffer.slice(byteOffset, byteOffset + byteLength);
        });
    }

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferIndex
	 * @return {Promise<ArrayBuffer>}
	 */
    loadBuffer(bufferIndex) {
        let bufferDef = this.json.buffers[bufferIndex];
        if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
            throw new Error(bufferDef.type + ' buffer type is not supported yet');
        }
        let path = this.path;
        return fetch(resolveURL(bufferDef.uri, path)).then(response => {
            return response.arrayBuffer();
        })
    }

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	 * @param {number} materialIndex
     * Dependencies: texture
	 */
    loadMaterial(materialIndex) {
        let parser = this;
        let json = this.json;
        let materialDef = json.materials[materialIndex];
        let materialParams = {};
        let pending = [];
        let defines = {};
        let programeOpt = {};

        // Specification:
        // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material
        let metallicRoughness = materialDef.pbrMetallicRoughness || {};
        let { baseColorFactor, baseColorTexture } = metallicRoughness;
        // Base Color
        materialParams.u_BaseColorFactor = {
            value: Array.isArray(baseColorFactor) ? baseColorFactor : new Vec4(1.0, 1.0, 1.0, 1.0)
        };
        if (baseColorTexture !== undefined) {
            pending.push(parser.assignTexture(materialParams, 'u_BaseColorSampler', metallicRoughness.baseColorTexture.index));
            defines.HAS_BASECOLORMAP = 1;
        }
        // Metalness-Roughness
        let metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
        let roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;
        materialParams.u_MetallicRoughnessValues = {
            value: [metalness, roughness]
        };
        if (metallicRoughness.metallicRoughnessTexture !== undefined) {
            let textureIndex = metallicRoughness.metallicRoughnessTexture.index;
            pending.push(parser.assignTexture(materialParams, 'u_MetallicRoughnessSampler', textureIndex));
            defines.HAS_METALROUGHNESSMAP = 1;
        }
        // Normals
        if (materialDef.normalTexture !== undefined) {
            pending.push(parser.assignTexture(materialParams, 'u_NormalSampler', materialDef.normalTexture.index));
            materialParams.u_NormalScale = {
                value: materialDef.normalTexture.scale || 1.0
            };
            defines.HAS_NORMALMAP = 1;
        }
        // BRDFLUT
        pending.push(parser.loadTextureFromSrc(materialParams, 'tLUT', BRDF_LUT_URL, false));
        if (parser.envDiffuseCubeMapSrc) pending.push(parser.loadCubeMapFromSrc(materialParams, 'tEnvDiffuse', parser.envDiffuseCubeMapSrc, false));
        if (parser.envSpecularCubeMapSrc) pending.push(parser.loadCubeMapFromSrc(materialParams, 'tEnvSpecular', parser.envSpecularCubeMapSrc, false));

        // Emissive
        if (materialDef.emissiveTexture !== undefined) {
            if (materialDef.emissiveFactor !== undefined) {
                materialParams.u_EmissiveFactor = {
                    value: new Color().fromArray(materialDef.emissiveFactor)
                }
            }
            pending.push(parser.assignTexture(materialParams, 'u_EmissiveSampler', materialDef.emissiveTexture.index));
            defines.HAS_EMISSIVEMAP = 1;
        }

        // AO
        if (materialDef.occlusionTexture !== undefined) {
            pending.push(parser.assignTexture(materialParams, 'u_OcclusionSampler', materialDef.occlusionTexture.index));
            materialParams.u_OcclusionStrength = {
                value: materialDef.occlusionTexture.strength || 1.0
            }
        }

        // Alpha
        let alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
        if (alphaMode === ALPHA_MODES.BLEND) {
            programeOpt.transparent = true;
        } else {
            programeOpt.transparent = false;
        }

        return Promise.all(pending).then(function () {
            let material = {
                uniforms: materialParams,
                glTFLoaderDefines: defines,
                options: programeOpt
            };
            return material;
        });
    };

    /**
	 * Asynchronously assigns a texture to the given material parameters.
	 * @param {Object} materialParams
	 * @param {string} textureName
	 * @param {number} textureIndex
	 * @return {Promise}
	 */
    assignTexture(materialParams, textureName, textureIndex) {
        return this.getDependency('texture', textureIndex).then(function (texture) {
            materialParams[textureName] = { value: texture };
        });
    }

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
	 * @param {number} textureIndex
	 */
    loadTexture(textureIndex) {
        let parser = this;
        let json = this.json;
        let URL = window.URL || window.webkitURL;
        let textureDef = json.textures[textureIndex];
        let source;
        source = json.images[textureDef.source];
        let sourceURI = source.uri;
        if (source.bufferView !== undefined) {
            //Todo: Load binary image data from bufferView, if provided.
            sourceURI = parser.getDependency('bufferView', source.bufferView).then(function (bufferView) {
                isObjectURL = true;
                var blob = new Blob([bufferView], { type: source.mimeType });
                sourceURI = URL.createObjectURL(blob);
                return sourceURI;
            });
        }
        return new Promise(function (resolve) {
            // Load Texture resource.
            let src = resolveURL(sourceURI, parser.path);
            const texture = new Texture(parser.gl, {
                flipY: false
            });
            const image = new Image();
            image.onload = () => {
                texture.image = image;
                return resolve(texture);
            };
            image.src = src;
        }).then(function (texture) {
            // Clean up resources and configure Texture.
            if (textureDef.name !== undefined) texture.name = textureDef.name;
            // Ignore unknown mime types, like DDS files.
            if (source.mimeType) {
                switch (source.mimeType) {
                    case 'image/png':
                        texture.format = parser.gl.RGBA;
                        break;
                    case 'image/jpeg':
                        texture.format = parser.gl.RGB;
                        break;
                    default:
                        break;
                }
            }
            let samplers = json.samplers || {};
            let sampler = samplers[textureDef.sampler] || {};
            texture.magFilter = sampler.magFilter || parser.gl.LINEAR;
            texture.minFilter = sampler.minFilter || parser.gl.LINEAR_MIPMAP_LINEAR;
            //默认为 gl.REPEAT
            texture.wrapS = sampler.wrapS || parser.gl.REPEAT;
            texture.wrapT = sampler.wrapT || parser.gl.REPEAT;
            return texture;
        });
    }

    loadTextureFromSrc(materialParams, key, src, generateMipmaps = true) {
        let parser = this;
        return new Promise(function (resolve) {
            const texture = new Texture(parser.gl, {
                flipY: false,
                generateMipmaps
            });
            const image = new Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
                texture.image = image;
                materialParams[key] = { value: texture };
                resolve(texture);
            };
            image.src = src;
        })
    }

    loadCubeMapFromSrc(materialParams, key, src) {
        let parser = this;
        let path = src;
        let paths = [
            path + "px.jpg",
            path + "nx.jpg",
            path + "py.jpg",
            path + "ny.jpg",
            path + "pz.jpg",
            path + "nz.jpg"
        ];
        let pendings = [];
        for (let i = 0; i < paths.length; i++) {
            let pending = new Promise(function (resolve) {
                let image = new Image();
                image.onload = () => resolve(image);
                image.src = paths[i];
            })
            pendings.push(pending)
        }
        return Promise.all(pendings).then(function (obj) {
            const texture = new Texture(parser.gl, {
                target: parser.gl.TEXTURE_CUBE_MAP,
                image: obj[0],
                images: obj,
                flipY: false,
                generateMipmaps: false
            });
            materialParams[key] = { value: texture };
        })
    }

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
	 * @param {Array<Object>} primitives
	 */
    loadGeometries(primitives) {
        let parser = this;
        let cache = this.primitiveCache;
        return this.getDependencies('accessor').then(function (accessors) {
            let pending = [];
            for (let i = 0, il = primitives.length; i < il; i++) {
                let primitive = primitives[i];
                // Check Cache
                let cached = parser.getCachedGeometry(cache, primitive);
                if (cached) {
                    pending.push(cached);
                } else {
                    //Todo: Extension
                    let geometry = new Geometry(parser.gl);
                    addPrimitiveAttributes(geometry, primitive, accessors);
                    var geometryPromise = Promise.resolve(geometry);
                    pending.push(geometryPromise);
                    cache.push({ primitive: primitive, promise: geometryPromise });
                }
            }
            return Promise.all(pending).then(function (geometries) {
                return geometries;
            });
        });
    };
    getCachedGeometry(cache, newPrimitive) {
        for (let i = 0, il = cache.length; i < il; i++) {
            let cached = cache[i];
            if (isPrimitiveEqual(cached.primitive, newPrimitive)) return cached.promise;
        }
        return null;
    }

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
	 * @param {number} cameraIndex
	 */
    loadCamera(cameraIndex) {
        let camera;
        let cameraDef = this.json.cameras[cameraIndex];
        let params = cameraDef[cameraDef.type];
        if (!params) {
            console.warn('GLTFLoader: Missing camera parameters.');
            return;
        }
        if (cameraDef.type === 'perspective') {
            camera = new Camera({
                fov: radToDeg(params.yfov),
                aspect: params.aspectRatio || 1,
                near: params.znear || 1,
                far: params.zfar || 2e6
            });
        } else if (cameraDef.type === 'orthographic') {
            camera = new Camera({
                left: params.xmag / - 2,
                right: params.xmag / 2,
                top: params.ymag / 2,
                bottom: params.ymag / - 2,
                near: params.znear,
                far: params.zfar
            });
        }
        if (cameraDef.name !== undefined) camera.name = cameraDef.name;
        return Promise.resolve(camera);
    };

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
	 * @param {number} skinIndex
	 */
    loadSkin(skinIndex) {
        let skinDef = this.json.skins[skinIndex];
        let skinEntry = { joints: skinDef.joints };
        if (skinDef.inverseBindMatrices === undefined) {
            return Promise.resolve(skinEntry);
        }
        return this.getDependency('accessor', skinDef.inverseBindMatrices).then(function (accessor) {
            skinEntry.inverseBindMatrices = accessor;
            return skinEntry;
        });
    };

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
	 * @param {number} animationIndex
	 */
    loadAnimation(animationIndex) {
        let json = this.json;
        let parser = this;
        let animationDef = json.animations[animationIndex];
        return this.getMultiDependencies([
            'accessor',
            'node'
        ]).then(function (dependencies) {
            let group = parser.animationSys.group;
            for (let i = 0, il = animationDef.channels.length; i < il; i++) {
                let channel = animationDef.channels[i];
                let sampler = animationDef.samplers[channel.sampler];
                if (sampler) {
                    let target = channel.target;
                    let name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
                    let input = animationDef.parameters !== undefined ? animationDef.parameters[sampler.input] : sampler.input;
                    let output = animationDef.parameters !== undefined ? animationDef.parameters[sampler.output] : sampler.output;
                    let timeLine = dependencies.accessors[input]; //timeAccessor
                    let keyFrame = dependencies.accessors[output]; //transformAccessor
                    let node = dependencies.nodes[name];
                    if (node) {
                        //Key Frame Animation
                        //Skeleton Animation
                        node.updateMatrix();
                        node.matrixAutoUpdate = true;
                        let controlChannel;
                        //Check track format
                        switch (target.path) {
                            case "rotation":
                                controlChannel = node.quaternion; //对象引用,直接改就行
                                break;
                            case "translation":
                                controlChannel = node.position;
                                break;
                            case "scale":
                                controlChannel = node.scale;
                                break;
                            case "weights":
                                //Morph target weights animation
                                controlChannel = node.program.uniforms.TAR_WEIGHT.value;
                                break;
                        }
                        if (controlChannel) {
                            let anim;
                            if (node.Animation) {
                                anim = node.Animation;
                            } else {
                                anim = new Animation();
                                node.Animation = anim;
                            }
                            if (target.path === "weights") {
                                keyFrame.size = 2;
                            }
                            let keyFrameData = sliceBlockData(keyFrame);
                            let animationChannel = new AnimationChannel(controlChannel, timeLine.data, keyFrameData);
                            anim.attachChannel(animationChannel);
                            group.push(anim);
                        }
                    }
                }
            }
            return group;
        });
    };
};

/**
 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#morph-targets
 *
 */
function addMorphTargets(geometry, targets, accessors) {
    let length = targets.length;
    if (length > 2) console.warn('Unsupport length > 2 targets');
    for (let i = 0; i < length; i++) {
        let target = targets[i]
        for (let key in target) {
            let bufferAttribute = accessors[target[key]];
            //Postion
            if (key === 'POSITION') {
                let attributeName = `TAR_POSITION_${i}`;
                geometry.addAttribute(attributeName, bufferAttribute);
            }
            //Normal
            if (key === 'NORMAL') {
                let attributeName = `TAR_NORMAL_${i}`;
                geometry.addAttribute(attributeName, bufferAttribute);
            }
        }
    }
}
function addPrimitiveAttributes(geometry, primitiveDef, accessors) {
    let attributes = primitiveDef.attributes;
    let defines = {};
    for (let gltfAttributeName in attributes) {
        // Record the defines
        switch (gltfAttributeName) {
            case "NORMAL":
                defines.HAS_NORMALS = 1;
                break;
            case "TANGENT":
                defines.HAS_TANGENTS = 1;
                break;
            case "TEXCOORD_0":
                defines.HAS_UV = 1;
                break;
        }
        let lglAttributeName = ATTRIBUTES[gltfAttributeName];
        let bufferAttribute = accessors[attributes[gltfAttributeName]];
        if (!lglAttributeName) continue;
        if (lglAttributeName in geometry.attributes) continue;
        geometry.addAttribute(lglAttributeName, bufferAttribute);
    }
    if (primitiveDef.indices !== undefined && !geometry.index) {
        geometry.setIndex(accessors[primitiveDef.indices]);
    }
    if (primitiveDef.targets !== undefined) {
        defines.HAS_MORPH_TARGETS = 1;
        addMorphTargets(geometry, primitiveDef.targets, accessors);
    }
    geometry.glTFLoaderDefines = defines;
}

