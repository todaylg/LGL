import { Transform, Mat4, Camera, Color } from '/src/index.js';
import { GLTFRegistry, resolveURL } from './util.js';
import { WEBGL_TYPE_SIZES, WEBGL_COMPONENT_TYPES, EXTENSIONS } from './const.js';
import { BufferAttribute } from './bufferHandler/BufferAttribute.js';
export default class GLTFParser {
    constructor(json, options={}) {
        this.json = json || {};
        // loader object cache
        this.cache = new GLTFRegistry();
        this.path = options.path || '';
    }
    parse(onLoad, onError) {
        let json = this.json;
        // Clear the loader cache
        this.cache.removeAll();
        // Mark the special nodes/meshes in json for efficient parse
        this.markDefs();
        // Load data info
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
	 * Marks the special nodes/meshes in json for efficient parse.
	 */
    markDefs() {
        let nodeDefs = this.json.nodes || [];
        let skinDefs = this.json.skins || [];
        let meshDefs = this.json.meshes || [];
        let meshReferences = {};
        let meshUses = {};
        // Nothing in the node definition indicates whether it is a Bone or an
        // Object3D. Use the skins' joint references to mark bones.
        for (let skinIndex = 0, skinLength = skinDefs.length; skinIndex < skinLength; skinIndex++) {
            let joints = skinDefs[skinIndex].joints;
            for (let i = 0, il = joints.length; i < il; i++) {
                nodeDefs[joints[i]].isBone = true;
            }
        }
        // Meshes can (and should) be reused by multiple nodes in a glTF asset. To
        // avoid having more than one Mesh instance with the same name, count
        // references and rename instances below.
        for (let nodeIndex = 0, nodeLength = nodeDefs.length; nodeIndex < nodeLength; nodeIndex++) {
            let nodeDef = nodeDefs[nodeIndex];
            if (nodeDef.mesh !== undefined) {
                if (meshReferences[nodeDef.mesh] === undefined) {
                    meshReferences[nodeDef.mesh] = meshUses[nodeDef.mesh] = 0;
                }
                meshReferences[nodeDef.mesh]++;
                // Nothing in the mesh definition indicates whether it is
                // a SkinnedMesh or Mesh. Use the node's mesh reference
                // to mark SkinnedMesh if node has skin.
                if (nodeDef.skin !== undefined) {
                    meshDefs[nodeDef.mesh].isSkinnedMesh = true;
                }
            }
        }
        this.json.meshReferences = meshReferences;
        this.json.meshUses = meshUses;
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
            value = value.then(function (key, value) {//直接bind？
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
        let cacheKey = type + ':' + index;
        let dependency = this.cache.get(cacheKey);
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
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
	 * @param {number} sceneIndex
	 * @return {Transform}
     * Dependencies: node、skin
	 */
    loadScene(sceneIndex) {
        // scene node hierachy builder
        let json = this.json;
        let sceneDef = this.json.scenes[sceneIndex];
        return this.getMultiDependencies([
            'node'
        ]).then(function (dependencies) {
            let scene = new Transform();
            if (sceneDef.name !== undefined) scene.name = sceneDef.name;
            let nodeIds = sceneDef.nodes || [];
            for (let i = 0, il = nodeIds.length; i < il; i++) {
                buildNodeHierachy(nodeIds[i], scene, json, dependencies.nodes);
            }
            return scene;
        });
        function buildNodeHierachy(nodeId, parentObject, json, allNodes) {
            let node = allNodes[nodeId];
            let nodeDef = json.nodes[nodeId];
            // build node hierachy
            parentObject.add(node);
            if (nodeDef.children) {
                let children = nodeDef.children;
                for (let i = 0, il = children.length; i < il; i++) {
                    let child = children[i];
                    buildNodeHierachy(child, node, json, allNodes);
                }
            }
        }
    }
    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
	 * @param {number} nodeIndex
	 * @return {Promise<THREE.Object3D>}
     * Dependencies: mesh、skin、camera
	 */
    loadNode(nodeIndex) {
        let json = this.json;
        let meshReferences = json.meshReferences;
        let meshUses = json.meshUses;
        let nodeDef = json.nodes[nodeIndex];
        return this.getMultiDependencies([
            'mesh',
            'camera',
        ]).then(function (dependencies) {
            let node;
            // .isBone isn't in glTF spec. See .markDefs
            if (nodeDef.isBone === true) {
                console.warn(".isBone isn't in glTF spec, no support yet");
            } else if (nodeDef.mesh !== undefined) {
                let mesh = dependencies.meshes[nodeDef.mesh];
                // Mesh复用
                if (meshReferences[nodeDef.mesh] > 1) {
                    let instanceNum = meshUses[nodeDef.mesh]++;
                    node = mesh.clone();
                    node.name += '_instance_' + instanceNum;
                    // onBeforeRender copy for Specular-Glossiness
                    node.onBeforeRender = mesh.onBeforeRender;
                    for (let i = 0, il = node.children.length; i < il; i++) {
                        node.children[i].name += '_instance_' + instanceNum;
                        node.children[i].onBeforeRender = mesh.children[i].onBeforeRender;
                    }
                } else {
                    node = mesh;
                }
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
    * @return {Promise<THREE.Group|THREE.Mesh|THREE.SkinnedMesh>}
    * Dependencies: accessor、material
    */
    loadMesh(meshIndex) {
        let scope = this;
        let json = this.json;
        let extensions = this.extensions;
        let meshDef = json.meshes[meshIndex];
        return this.getMultiDependencies([
            'accessor',
            'material'
        ]).then(function (dependencies) {
            let primitives = meshDef.primitives;
            let originalMaterials = [];
            for (let i = 0, il = primitives.length; i < il; i++) {
                originalMaterials[i] = primitives[i].material === undefined
                    ? createDefaultMaterial()
                    : dependencies.materials[primitives[i].material];
            }
            return scope.loadGeometries(primitives).then(function (geometries) {
                let isMultiMaterial = geometries.length === 1 && geometries[0].groups.length > 0;
                let meshes = [];
                for (let i = 0, il = geometries.length; i < il; i++) {
                    let geometry = geometries[i];
                    let primitive = primitives[i];
                    // 1. create Mesh
                    let mesh;
                    let material = isMultiMaterial ? originalMaterials : originalMaterials[i];
                    if (primitive.mode === WEBGL_CONSTANTS.TRIANGLES ||
                        primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP ||
                        primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN ||
                        primitive.mode === undefined) {
                        // .isSkinnedMesh isn't in glTF spec. See .markDefs()
                        mesh = meshDef.isSkinnedMesh === true
                            ? new THREE.SkinnedMesh(geometry, material)
                            : new THREE.Mesh(geometry, material);
                        if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_STRIP) {
                            mesh.drawMode = THREE.TriangleStripDrawMode;
                        } else if (primitive.mode === WEBGL_CONSTANTS.TRIANGLE_FAN) {
                            mesh.drawMode = THREE.TriangleFanDrawMode;
                        }
                    } else if (primitive.mode === WEBGL_CONSTANTS.LINES) {
                        mesh = new THREE.LineSegments(geometry, material);
                    } else if (primitive.mode === WEBGL_CONSTANTS.LINE_STRIP) {
                        mesh = new THREE.Line(geometry, material);
                    } else if (primitive.mode === WEBGL_CONSTANTS.LINE_LOOP) {
                        mesh = new THREE.LineLoop(geometry, material);
                    } else if (primitive.mode === WEBGL_CONSTANTS.POINTS) {
                        mesh = new THREE.Points(geometry, material);
                    } else {
                        throw new Error('THREE.GLTFLoader: Primitive mode unsupported: ' + primitive.mode);
                    }
                    if (Object.keys(mesh.geometry.morphAttributes).length > 0) {
                        updateMorphTargets(mesh, meshDef);
                    }
                    mesh.name = meshDef.name || ('mesh_' + meshIndex);
                    if (geometries.length > 1) mesh.name += '_' + i;
                    assignExtrasToUserData(mesh, meshDef);
                    meshes.push(mesh);
                    // 2. update Material depending on Mesh and BufferGeometry
                    let materials = isMultiMaterial ? mesh.material : [mesh.material];
                    let useVertexColors = geometry.attributes.color !== undefined;
                    let useFlatShading = geometry.attributes.normal === undefined;
                    let useSkinning = mesh.isSkinnedMesh === true;
                    let useMorphTargets = Object.keys(geometry.morphAttributes).length > 0;
                    let useMorphNormals = useMorphTargets && geometry.morphAttributes.normal !== undefined;
                    for (let j = 0, jl = materials.length; j < jl; j++) {
                        let material = materials[j];
                        if (mesh.isPoints) {
                            let cacheKey = 'PointsMaterial:' + material.uuid;
                            let pointsMaterial = scope.cache.get(cacheKey);
                            if (!pointsMaterial) {
                                pointsMaterial = new THREE.PointsMaterial();
                                THREE.Material.prototype.copy.call(pointsMaterial, material);
                                pointsMaterial.color.copy(material.color);
                                pointsMaterial.map = material.map;
                                pointsMaterial.lights = false; // PointsMaterial doesn't support lights yet
                                scope.cache.add(cacheKey, pointsMaterial);
                            }
                            material = pointsMaterial;
                        } else if (mesh.isLine) {
                            let cacheKey = 'LineBasicMaterial:' + material.uuid;
                            let lineMaterial = scope.cache.get(cacheKey);
                            if (!lineMaterial) {
                                lineMaterial = new THREE.LineBasicMaterial();
                                THREE.Material.prototype.copy.call(lineMaterial, material);
                                lineMaterial.color.copy(material.color);
                                lineMaterial.lights = false; // LineBasicMaterial doesn't support lights yet
                                scope.cache.add(cacheKey, lineMaterial);
                            }
                            material = lineMaterial;
                        }
                        // Clone the material if it will be modified
                        if (useVertexColors || useFlatShading || useSkinning || useMorphTargets) {
                            let cacheKey = 'ClonedMaterial:' + material.uuid + ':';
                            if (material.isGLTFSpecularGlossinessMaterial) cacheKey += 'specular-glossiness:';
                            if (useSkinning) cacheKey += 'skinning:';
                            if (useVertexColors) cacheKey += 'vertex-colors:';
                            if (useFlatShading) cacheKey += 'flat-shading:';
                            if (useMorphTargets) cacheKey += 'morph-targets:';
                            if (useMorphNormals) cacheKey += 'morph-normals:';
                            let cachedMaterial = scope.cache.get(cacheKey);
                            if (!cachedMaterial) {
                                cachedMaterial = material.isGLTFSpecularGlossinessMaterial
                                    ? extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].cloneMaterial(material)
                                    : material.clone();
                                if (useSkinning) cachedMaterial.skinning = true;
                                if (useVertexColors) cachedMaterial.vertexColors = THREE.VertexColors;
                                if (useFlatShading) cachedMaterial.flatShading = true;
                                if (useMorphTargets) cachedMaterial.morphTargets = true;
                                if (useMorphNormals) cachedMaterial.morphNormals = true;
                                scope.cache.add(cacheKey, cachedMaterial);
                            }
                            material = cachedMaterial;
                        }
                        materials[j] = material;
                        // workarounds for mesh and geometry
                        if (material.aoMap && geometry.attributes.uv2 === undefined && geometry.attributes.uv !== undefined) {
                            console.log('THREE.GLTFLoader: Duplicating UVs to support aoMap.');
                            geometry.addAttribute('uv2', new BufferAttribute(geometry.attributes.uv.array, 2));
                        }
                        if (material.isGLTFSpecularGlossinessMaterial) {
                            // for GLTFSpecularGlossinessMaterial(ShaderMaterial) uniforms runtime update
                            mesh.onBeforeRender = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].refreshUniforms;
                        }
                    }
                    mesh.material = isMultiMaterial ? materials : materials[0];
                }
                if (meshes.length === 1) {
                    return meshes[0];
                }
                let group = new THREE.Group();
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
	 * @return {Promise<BufferAttribute|THREE.InterleavedBufferAttribute>}
     * Dependencies: bufferView
	 */
    loadAccessor(accessorIndex) {
        let parser = this;
        let json = this.json;
        let accessorDef = this.json.accessors[accessorIndex];
        if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {
            // Ignore empty accessors, which may be used to declare runtime
            // information about attributes coming from another source (e.g. Draco
            // compression extension).
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
            console.log("bufferView",bufferView);
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
                let ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType;
                let ib = parser.cache.get(ibCacheKey);
                if (!ib) {
                    // Use the full buffer if it's interleaved.
                    array = new TypedArray(bufferView);
                    // Integer parameters to IB/IBA are in array elements, not bytes.
                    // 处理Buffer需要去Three.js
                    ib = new THREE.InterleavedBuffer(array, byteStride / elementBytes);
                    parser.cache.add(ibCacheKey, ib);
                }
                bufferAttribute = new THREE.InterleavedBufferAttribute(ib, itemSize, byteOffset / elementBytes, normalized);
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
                    if (itemSize >= 5) throw new Error('GLTFLoader: Unsupported itemSize in sparse BufferAttribute.');
                }
            }
            console.log("bufferAttribute", bufferAttribute);
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
            throw new Error('GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.');
        }
        let path = this.path;
        return fetch(resolveURL(bufferDef.uri, path)).then(response => {
            return response.arrayBuffer();
        })
    }

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	 * @param {number} materialIndex
	 * @return {Promise<THREE.Material>}
     * Dependencies: texture
	 */
    loadMaterial(materialIndex) {
        let parser = this;
        let json = this.json;
        let extensions = this.extensions;
        let materialDef = json.materials[materialIndex];
        let materialType;
        let materialParams = {};
        let materialExtensions = materialDef.extensions || {};
        let pending = [];
        if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
            let sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
            materialType = sgExtension.getMaterialType(materialDef);
            pending.push(sgExtension.extendParams(materialParams, materialDef, parser));
        } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
            let kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
            materialType = kmuExtension.getMaterialType(materialDef);
            pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
        } else {
            // Specification:
            // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material
            // materialType = THREE.MeshStandardMaterial;
            let metallicRoughness = materialDef.pbrMetallicRoughness || {};
            materialParams.color = new Color(1.0, 1.0, 1.0);
            materialParams.opacity = 1.0;
            if (Array.isArray(metallicRoughness.baseColorFactor)) {
                var array = metallicRoughness.baseColorFactor;
                materialParams.color.fromArray(array);
                materialParams.opacity = array[3];
            }
            if (metallicRoughness.baseColorTexture !== undefined) {
                pending.push(parser.assignTexture(materialParams, 'map', metallicRoughness.baseColorTexture.index));
            }
            materialParams.metalness = metallicRoughness.metallicFactor !== undefined ? metallicRoughness.metallicFactor : 1.0;
            materialParams.roughness = metallicRoughness.roughnessFactor !== undefined ? metallicRoughness.roughnessFactor : 1.0;
            if (metallicRoughness.metallicRoughnessTexture !== undefined) {
                var textureIndex = metallicRoughness.metallicRoughnessTexture.index;
                pending.push(parser.assignTexture(materialParams, 'metalnessMap', textureIndex));
                pending.push(parser.assignTexture(materialParams, 'roughnessMap', textureIndex));
            }
        }
        if (materialDef.doubleSided === true) {
            materialParams.side = THREE.DoubleSide;
        }
        var alphaMode = materialDef.alphaMode || ALPHA_MODES.OPAQUE;
        if (alphaMode === ALPHA_MODES.BLEND) {
            materialParams.transparent = true;
        } else {
            materialParams.transparent = false;
            if (alphaMode === ALPHA_MODES.MASK) {
                materialParams.alphaTest = materialDef.alphaCutoff !== undefined ? materialDef.alphaCutoff : 0.5;
            }
        }
        if (materialDef.normalTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
            pending.push(parser.assignTexture(materialParams, 'normalMap', materialDef.normalTexture.index));
            materialParams.normalScale = new THREE.Vector2(1, 1);
            if (materialDef.normalTexture.scale !== undefined) {
                materialParams.normalScale.set(materialDef.normalTexture.scale, materialDef.normalTexture.scale);
            }
        }
        if (materialDef.occlusionTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
            pending.push(parser.assignTexture(materialParams, 'aoMap', materialDef.occlusionTexture.index));
            if (materialDef.occlusionTexture.strength !== undefined) {
                materialParams.aoMapIntensity = materialDef.occlusionTexture.strength;
            }
        }
        if (materialDef.emissiveFactor !== undefined && materialType !== THREE.MeshBasicMaterial) {
            materialParams.emissive = new THREE.Color().fromArray(materialDef.emissiveFactor);
        }
        if (materialDef.emissiveTexture !== undefined && materialType !== THREE.MeshBasicMaterial) {
            pending.push(parser.assignTexture(materialParams, 'emissiveMap', materialDef.emissiveTexture.index));
        }
        return Promise.all(pending).then(function () {
            var material;
            if (materialType === THREE.ShaderMaterial) {
                material = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS].createMaterial(materialParams);
            } else {
                material = new materialType(materialParams);
            }
            if (materialDef.name !== undefined) material.name = materialDef.name;
            // Normal map textures use OpenGL conventions:
            // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#materialnormaltexture
            if (material.normalScale) {
                material.normalScale.y = - material.normalScale.y;
            }
            // baseColorTexture, emissiveTexture, and specularGlossinessTexture use sRGB encoding.
            if (material.map) material.map.encoding = THREE.sRGBEncoding;
            if (material.emissiveMap) material.emissiveMap.encoding = THREE.sRGBEncoding;
            if (material.specularMap) material.specularMap.encoding = THREE.sRGBEncoding;
            assignExtrasToUserData(material, materialDef);
            if (materialDef.extensions) addUnknownExtensionsToUserData(extensions, material, materialDef);
            return material;
        });

    };
    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
	 * @param {number} cameraIndex
	 * @return {Promise<THREE.Camera>}
	 */
    loadCamera(cameraIndex) {
        let camera;
        let cameraDef = this.json.cameras[cameraIndex];
        let params = cameraDef[cameraDef.type];
        if (!params) {
            console.warn('GLTFLoader: Missing camera parameters.'); debugger
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
        assignExtrasToUserData(camera, cameraDef);
        return Promise.resolve(camera);
    };
};