/* GLTF PARSER */
import { Transform, Mat4, Camera, Color, Texture, Geometry, Mesh, Program, Vec3 } from '/src/index.js';
import { assignExtrasToUserData, radToDeg, EXTENSIONS } from './glTFLoaderUtil.js';

export default class GLTFParser {
    constructor(json, extensions, options) {
        this.json = json || {};
        this.extensions = extensions || {};
        this.options = options || {};
        // loader object cache
        this.cache = new GLTFRegistry();
        // BufferGeometry caching
        this.primitiveCache = [];
        this.multiplePrimitivesCache = [];  ``
        this.multiPassGeometryCache = [];
    }

    //init dependencies: scene、animation、camera   
    parse(onLoad, onError) {
        let json = this.json;
        // Clear the loader cache
        this.cache.removeAll();
        // Mark the special nodes/meshes in json for efficient parse
        this.markDefs();
        // Fire the callback on complete
        this.getMultiDependencies([//load data info
            'scene',
            'animation',
            'camera'
        ]).then(function (dependencies) {
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
            value = value.then(function (key, value) {
                results[key] = value;
            }.bind(this, type + (type === 'mesh' ? 'es' : 's')));
            pendings.push(value);
        }
        return Promise.all(pendings).then(function () {
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
	 * @return {Promise<THREE.Scene>}
     * Dependencies: node、skin
	 */
    loadScene(sceneIndex) {
        // scene node hierachy builder
        let json = this.json;
        let extensions = this.extensions;
        let sceneDef = this.json.scenes[sceneIndex];
        return this.getMultiDependencies([
            'node',
            'skin'
        ]).then(function (dependencies) {
            let scene = new Transform();
            if (sceneDef.name !== undefined) scene.name = sceneDef.name;
            assignExtrasToUserData(scene, sceneDef);
            if (sceneDef.extensions) addUnknownExtensionsToUserData(extensions, scene, sceneDef);
            let nodeIds = sceneDef.nodes || [];
            for (let i = 0, il = nodeIds.length; i < il; i++) {
                buildNodeHierachy(nodeIds[i], scene, json, dependencies.nodes, dependencies.skins);
            }
            return scene;
        });
        function buildNodeHierachy(nodeId, parentObject, json, allNodes, skins) {
            let node = allNodes[nodeId];
            let nodeDef = json.nodes[nodeId];
            // build skeleton here as well
            if (nodeDef.skin !== undefined) {
                let meshes = node.isGroup === true ? node.children : [node];
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
                                mat.fromArray(skinEntry.inverseBindMatrices.array, j * 16);
                            }
                            boneInverses.push(mat);
                        } else {
                            console.warn('GLTFLoader: Joint "%s" could not be found.', jointId);
                        }
                    }
                    //Bind???? and Skeleton????
                    //mesh.bind(new THREE.Skeleton(bones, boneInverses), mesh.matrixWorld);
                }
            }
            // build node hierachy
            parentObject.add(node);
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
	 * @return {Promise<THREE.Object3D>}
     * Dependencies: mesh、skin、camera
	 */
    loadNode(nodeIndex) {
        var json = this.json;
        var extensions = this.extensions;
        var meshReferences = json.meshReferences;
        var meshUses = json.meshUses;
        var nodeDef = json.nodes[nodeIndex];
        return this.getMultiDependencies([
            'mesh',
            'skin',
            'camera',
            'light'//light需要插件支持
        ]).then(function (dependencies) {
            var node;
            // .isBone isn't in glTF spec. See .markDefs
            if (nodeDef.isBone === true) {
                console.warn(".isBone isn't in glTF spec, no support yet");
            } else if (nodeDef.mesh !== undefined) {
                var mesh = dependencies.meshes[nodeDef.mesh];
                if (meshReferences[nodeDef.mesh] > 1) {
                    var instanceNum = meshUses[nodeDef.mesh]++;
                    node = mesh.clone();
                    node.name += '_instance_' + instanceNum;
                    // onBeforeRender copy for Specular-Glossiness
                    node.onBeforeRender = mesh.onBeforeRender;
                    for (var i = 0, il = node.children.length; i < il; i++) {
                        node.children[i].name += '_instance_' + instanceNum;
                        node.children[i].onBeforeRender = mesh.children[i].onBeforeRender;
                    }
                } else {
                    node = mesh;
                }
            } else if (nodeDef.camera !== undefined) {
                node = dependencies.cameras[nodeDef.camera];
            } else if (nodeDef.extensions
                && nodeDef.extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL]
                && nodeDef.extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL].light !== undefined) {
                var lights = extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL].lights;
                node = lights[nodeDef.extensions[EXTENSIONS.KHR_LIGHTS_PUNCTUAL].light];
            } else {
                node = new THREE.Object3D();
            }
            if (nodeDef.name !== undefined) {
                node.name = THREE.PropertyBinding.sanitizeNodeName(nodeDef.name);
            }
            assignExtrasToUserData(node, nodeDef);
            if (nodeDef.extensions) addUnknownExtensionsToUserData(extensions, node, nodeDef);
            if (nodeDef.matrix !== undefined) {
                var matrix = new THREE.Matrix4();
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
        var scope = this;
        var json = this.json;
        var extensions = this.extensions;
        var meshDef = json.meshes[meshIndex];
        return this.getMultiDependencies([
            'accessor',
            'material'
        ]).then(function (dependencies) {
            var primitives = meshDef.primitives;
            var originalMaterials = [];
            for (var i = 0, il = primitives.length; i < il; i++) {
                originalMaterials[i] = primitives[i].material === undefined
                    ? createDefaultMaterial()
                    : dependencies.materials[primitives[i].material];
            }
            return scope.loadGeometries(primitives).then(function (geometries) {
                var isMultiMaterial = geometries.length === 1 && geometries[0].groups.length > 0;
                var meshes = [];
                for (var i = 0, il = geometries.length; i < il; i++) {
                    var geometry = geometries[i];
                    var primitive = primitives[i];
                    // 1. create Mesh
                    var mesh;
                    var material = isMultiMaterial ? originalMaterials : originalMaterials[i];
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
                    var materials = isMultiMaterial ? mesh.material : [mesh.material];
                    var useVertexColors = geometry.attributes.color !== undefined;
                    var useFlatShading = geometry.attributes.normal === undefined;
                    var useSkinning = mesh.isSkinnedMesh === true;
                    var useMorphTargets = Object.keys(geometry.morphAttributes).length > 0;
                    var useMorphNormals = useMorphTargets && geometry.morphAttributes.normal !== undefined;
                    for (var j = 0, jl = materials.length; j < jl; j++) {
                        var material = materials[j];
                        if (mesh.isPoints) {
                            var cacheKey = 'PointsMaterial:' + material.uuid;
                            var pointsMaterial = scope.cache.get(cacheKey);
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
                            var cacheKey = 'LineBasicMaterial:' + material.uuid;
                            var lineMaterial = scope.cache.get(cacheKey);
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
                            var cacheKey = 'ClonedMaterial:' + material.uuid + ':';
                            if (material.isGLTFSpecularGlossinessMaterial) cacheKey += 'specular-glossiness:';
                            if (useSkinning) cacheKey += 'skinning:';
                            if (useVertexColors) cacheKey += 'vertex-colors:';
                            if (useFlatShading) cacheKey += 'flat-shading:';
                            if (useMorphTargets) cacheKey += 'morph-targets:';
                            if (useMorphNormals) cacheKey += 'morph-normals:';
                            var cachedMaterial = scope.cache.get(cacheKey);
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
                            geometry.addAttribute('uv2', new THREE.BufferAttribute(geometry.attributes.uv.array, 2));
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
                var group = new THREE.Group();
                for (var i = 0, il = meshes.length; i < il; i++) {
                    group.add(meshes[i]);
                }
                return group;
            });
        });
    };

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
	 * @param {number} skinIndex
	 * @return {Promise<Object>}
     * Dependencies: accessor
	 */
    loadSkin(skinIndex) {
        var skinDef = this.json.skins[skinIndex];
        var skinEntry = { joints: skinDef.joints };
        if (skinDef.inverseBindMatrices === undefined) {
            return Promise.resolve(skinEntry);
        }
        return this.getDependency('accessor', skinDef.inverseBindMatrices).then(function (accessor) {
            skinEntry.inverseBindMatrices = accessor;
            return skinEntry;
        });
    };

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
	 * @param {number} accessorIndex
	 * @return {Promise<THREE.BufferAttribute|THREE.InterleavedBufferAttribute>}
     * Dependencies: bufferView
	 */
    loadAccessor(accessorIndex) {
        var parser = this;
        var json = this.json;
        var accessorDef = this.json.accessors[accessorIndex];
        if (accessorDef.bufferView === undefined && accessorDef.sparse === undefined) {
            // Ignore empty accessors, which may be used to declare runtime
            // information about attributes coming from another source (e.g. Draco
            // compression extension).
            return null;
        }
        var pendingBufferViews = [];
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
            var bufferView = bufferViews[0];
            var itemSize = WEBGL_TYPE_SIZES[accessorDef.type];
            var TypedArray = WEBGL_COMPONENT_TYPES[accessorDef.componentType];
            // For VEC3: itemSize is 3, elementBytes is 4, itemBytes is 12.
            var elementBytes = TypedArray.BYTES_PER_ELEMENT;
            var itemBytes = elementBytes * itemSize;
            var byteOffset = accessorDef.byteOffset || 0;
            var byteStride = accessorDef.bufferView !== undefined ? json.bufferViews[accessorDef.bufferView].byteStride : undefined;
            var normalized = accessorDef.normalized === true;
            var array, bufferAttribute;
            // The buffer is not interleaved if the stride is the item size in bytes.
            if (byteStride && byteStride !== itemBytes) {
                var ibCacheKey = 'InterleavedBuffer:' + accessorDef.bufferView + ':' + accessorDef.componentType;
                var ib = parser.cache.get(ibCacheKey);
                if (!ib) {
                    // Use the full buffer if it's interleaved.
                    array = new TypedArray(bufferView);
                    // Integer parameters to IB/IBA are in array elements, not bytes.
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
                bufferAttribute = new THREE.BufferAttribute(array, itemSize, normalized);
            }
            // https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#sparse-accessors
            if (accessorDef.sparse !== undefined) {
                var itemSizeIndices = WEBGL_TYPE_SIZES.SCALAR;
                var TypedArrayIndices = WEBGL_COMPONENT_TYPES[accessorDef.sparse.indices.componentType];
                var byteOffsetIndices = accessorDef.sparse.indices.byteOffset || 0;
                var byteOffsetValues = accessorDef.sparse.values.byteOffset || 0;
                var sparseIndices = new TypedArrayIndices(bufferViews[1], byteOffsetIndices, accessorDef.sparse.count * itemSizeIndices);
                var sparseValues = new TypedArray(bufferViews[2], byteOffsetValues, accessorDef.sparse.count * itemSize);
                if (bufferView !== null) {
                    // Avoid modifying the original ArrayBuffer, if the bufferView wasn't initialized with zeroes.
                    bufferAttribute.setArray(bufferAttribute.array.slice());
                }
                for (var i = 0, il = sparseIndices.length; i < il; i++) {
                    var index = sparseIndices[i];
                    bufferAttribute.setX(index, sparseValues[i * itemSize]);
                    if (itemSize >= 2) bufferAttribute.setY(index, sparseValues[i * itemSize + 1]);
                    if (itemSize >= 3) bufferAttribute.setZ(index, sparseValues[i * itemSize + 2]);
                    if (itemSize >= 4) bufferAttribute.setW(index, sparseValues[i * itemSize + 3]);
                    if (itemSize >= 5) throw new Error('THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.');
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
        var bufferViewDef = this.json.bufferViews[bufferViewIndex];
        return this.getDependency('buffer', bufferViewDef.buffer).then(function (buffer) {
            var byteLength = bufferViewDef.byteLength || 0;
            var byteOffset = bufferViewDef.byteOffset || 0;
            return buffer.slice(byteOffset, byteOffset + byteLength);
        });
    }

    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
	 * @param {number} bufferIndex
	 * @return {Promise<ArrayBuffer>}
	 */
    loadBuffer(bufferIndex) {
        var bufferDef = this.json.buffers[bufferIndex];
        var loader = this.fileLoader;
        if (bufferDef.type && bufferDef.type !== 'arraybuffer') {
            throw new Error('THREE.GLTFLoader: ' + bufferDef.type + ' buffer type is not supported.');
        }
        // If present, GLB container is required to be the first buffer.
        if (bufferDef.uri === undefined && bufferIndex === 0) {
            return Promise.resolve(this.extensions[EXTENSIONS.KHR_BINARY_GLTF].body);
        }
        var options = this.options;
        return new Promise(function (resolve, reject) {
            loader.load(resolveURL(bufferDef.uri, options.path), resolve, undefined, function () {
                reject(new Error('THREE.GLTFLoader: Failed to load buffer "' + bufferDef.uri + '".'));
            });
        });
    }
    
    /**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
	 * @param {number} materialIndex
	 * @return {Promise<THREE.Material>}
     * Dependencies: texture
	 */
    loadMaterial(materialIndex) {
        var parser = this;
        var json = this.json;
        var extensions = this.extensions;
        var materialDef = json.materials[materialIndex];
        var materialType;
        var materialParams = {};
        var materialExtensions = materialDef.extensions || {};
        var pending = [];
        if (materialExtensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
            var sgExtension = extensions[EXTENSIONS.KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
            materialType = sgExtension.getMaterialType(materialDef);
            pending.push(sgExtension.extendParams(materialParams, materialDef, parser));
        } else if (materialExtensions[EXTENSIONS.KHR_MATERIALS_UNLIT]) {
            var kmuExtension = extensions[EXTENSIONS.KHR_MATERIALS_UNLIT];
            materialType = kmuExtension.getMaterialType(materialDef);
            pending.push(kmuExtension.extendParams(materialParams, materialDef, parser));
        } else {
            // Specification:
            // https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#metallic-roughness-material
            materialType = THREE.MeshStandardMaterial;
            var metallicRoughness = materialDef.pbrMetallicRoughness || {};
            materialParams.color = new THREE.Color(1.0, 1.0, 1.0);
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
	 * Asynchronously assigns a texture to the given material parameters.
	 * @param {Object} materialParams
	 * @param {string} textureName
	 * @param {number} textureIndex
	 * @return {Promise}
	 */
    assignTexture(materialParams, textureName, textureIndex) {
        return this.getDependency('texture', textureIndex).then(function (texture) {
            materialParams[textureName] = texture;
        });
    }
    
    /**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
	 * @param {number} textureIndex
	 * @return {Promise<THREE.Texture>}
	 */
    loadTexture(textureIndex) {
        var parser = this;
        var json = this.json;
        var options = this.options;
        var textureLoader = this.textureLoader;
        var URL = window.URL || window.webkitURL;
        var textureDef = json.textures[textureIndex];
        var textureExtensions = textureDef.extensions || {};
        var source;
        if (textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS]) {
            source = json.images[textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS].source];
        } else {
            source = json.images[textureDef.source];
        }
        var sourceURI = source.uri;
        var isObjectURL = false;
        if (source.bufferView !== undefined) {
            // Load binary image data from bufferView, if provided.
            sourceURI = parser.getDependency('bufferView', source.bufferView).then(function (bufferView) {
                isObjectURL = true;
                var blob = new Blob([bufferView], { type: source.mimeType });
                sourceURI = URL.createObjectURL(blob);
                return sourceURI;
            });
        }
        return Promise.resolve(sourceURI).then(function (sourceURI) {
            // Load Texture resource.
            var loader = THREE.Loader.Handlers.get(sourceURI);
            if (!loader) {
                loader = textureExtensions[EXTENSIONS.MSFT_TEXTURE_DDS]
                    ? parser.extensions[EXTENSIONS.MSFT_TEXTURE_DDS].ddsLoader
                    : textureLoader;
            }
            return new Promise(function (resolve, reject) {
                loader.load(resolveURL(sourceURI, options.path), resolve, undefined, reject);
            });
        }).then(function (texture) {
            // Clean up resources and configure Texture.
            if (isObjectURL === true) {
                URL.revokeObjectURL(sourceURI);
            }
            texture.flipY = false;
            if (textureDef.name !== undefined) texture.name = textureDef.name;
            // Ignore unknown mime types, like DDS files.
            if (source.mimeType in MIME_TYPE_FORMATS) {
                texture.format = MIME_TYPE_FORMATS[source.mimeType];
            }
            var samplers = json.samplers || {};
            var sampler = samplers[textureDef.sampler] || {};
            texture.magFilter = WEBGL_FILTERS[sampler.magFilter] || THREE.LinearFilter;
            texture.minFilter = WEBGL_FILTERS[sampler.minFilter] || THREE.LinearMipMapLinearFilter;
            texture.wrapS = WEBGL_WRAPPINGS[sampler.wrapS] || THREE.RepeatWrapping;
            texture.wrapT = WEBGL_WRAPPINGS[sampler.wrapT] || THREE.RepeatWrapping;
            return texture;
        });
    }
    
	/**
	 * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
	 *
	 * Creates BufferGeometries from primitives.
	 * If we can build a single BufferGeometry with .groups from multiple primitives, returns one BufferGeometry.
	 * Otherwise, returns BufferGeometries without .groups as many as primitives.
	 *
	 * @param {Array<Object>} primitives
	 * @return {Promise<Array<THREE.BufferGeometry>>}
	 */
    loadGeometries(primitives) {
        var parser = this;
        var extensions = this.extensions;
        var cache = this.primitiveCache;
        var isMultiPass = isMultiPassGeometry(primitives);
        var originalPrimitives;
        if (isMultiPass) {
            originalPrimitives = primitives; // save original primitives and use later
            // We build a single BufferGeometry with .groups from multiple primitives
            // because all primitives share the same attributes/morph/mode and have indices.
            primitives = [primitives[0]];
            // Sets .groups and combined indices to a geometry later in this method.
        }
        return this.getDependencies('accessor').then(function (accessors) {
            var pending = [];
            for (var i = 0, il = primitives.length; i < il; i++) {
                var primitive = primitives[i];
                // See if we've already created this geometry
                var cached = getCachedGeometry(cache, primitive);
                if (cached) {
                    // Use the cached geometry if it exists
                    pending.push(cached);
                } else if (primitive.extensions && primitive.extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]) {
                    // Use DRACO geometry if available
                    var geometryPromise = extensions[EXTENSIONS.KHR_DRACO_MESH_COMPRESSION]
                        .decodePrimitive(primitive, parser)
                        .then(function (geometry) {
                            addPrimitiveAttributes(geometry, primitive, accessors);
                            return geometry;
                        });
                    cache.push({ primitive: primitive, promise: geometryPromise });
                    pending.push(geometryPromise);
                } else {
                    // Otherwise create a new geometry
                    var geometry = new THREE.BufferGeometry();
                    addPrimitiveAttributes(geometry, primitive, accessors);
                    var geometryPromise = Promise.resolve(geometry);
                    // Cache this geometry
                    cache.push({ primitive: primitive, promise: geometryPromise });
                    pending.push(geometryPromise);
                }
            }
            return Promise.all(pending).then(function (geometries) {
                if (isMultiPass) {
                    var baseGeometry = geometries[0];
                    // See if we've already created this combined geometry
                    var cache = parser.multiPassGeometryCache;
                    var cached = getCachedMultiPassGeometry(cache, baseGeometry, originalPrimitives);
                    if (cached !== null) return [cached.geometry];
                    // Cloning geometry because of index override.
                    // Attributes can be reused so cloning by myself here.
                    var geometry = new THREE.BufferGeometry();
                    geometry.name = baseGeometry.name;
                    geometry.userData = baseGeometry.userData;
                    for (var key in baseGeometry.attributes) geometry.addAttribute(key, baseGeometry.attributes[key]);
                    for (var key in baseGeometry.morphAttributes) geometry.morphAttributes[key] = baseGeometry.morphAttributes[key];
                    var indices = [];
                    var offset = 0;
                    for (var i = 0, il = originalPrimitives.length; i < il; i++) {
                        var accessor = accessors[originalPrimitives[i].indices];
                        for (var j = 0, jl = accessor.count; j < jl; j++) indices.push(accessor.array[j]);
                        geometry.addGroup(offset, accessor.count, i);
                        offset += accessor.count;
                    }
                    geometry.setIndex(indices);
                    cache.push({ geometry: geometry, baseGeometry: baseGeometry, primitives: originalPrimitives });
                    return [geometry];
                } else if (geometries.length > 1 && THREE.BufferGeometryUtils !== undefined) {
                    // Tries to merge geometries with BufferGeometryUtils if possible
                    for (var i = 1, il = primitives.length; i < il; i++) {
                        // can't merge if draw mode is different
                        if (primitives[0].mode !== primitives[i].mode) return geometries;
                    }
                    // See if we've already created this combined geometry
                    var cache = parser.multiplePrimitivesCache;
                    var cached = getCachedCombinedGeometry(cache, geometries);
                    if (cached) {
                        if (cached.geometry !== null) return [cached.geometry];
                    } else {
                        var geometry = THREE.BufferGeometryUtils.mergeBufferGeometries(geometries, true);
                        cache.push({ geometry: geometry, baseGeometries: geometries });
                        if (geometry !== null) return [geometry];
                    }
                }
                return geometries;
            });
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
            console.warn('GLTFLoader: Missing camera parameters.');debugger
            return;
        }
        if (cameraDef.type === 'perspective') {
            camera = new Camera({
                fov:radToDeg(params.yfov),
                aspect: params.aspectRatio || 1, 
                near: params.znear || 1,
                far: params.zfar || 2e6
            });
        } else if (cameraDef.type === 'orthographic') {
            camera = new Camera({
                left:params.xmag / - 2,
                right: params.xmag / 2,
                top:params.ymag / 2,
                bottom: params.ymag / - 2,
                near: params.znear,
                far: params.zfar
            });
        }
        if (cameraDef.name !== undefined) camera.name = cameraDef.name;
        assignExtrasToUserData(camera, cameraDef);
        return Promise.resolve(camera);
    };
	
	/**
	 * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
	 * @param {number} animationIndex
	 * @return {Promise<THREE.AnimationClip>}
	 */
    loadAnimation(animationIndex) {
        var json = this.json;
        var animationDef = json.animations[animationIndex];
        return this.getMultiDependencies([
            'accessor',
            'node'
        ]).then(function (dependencies) {
            var tracks = [];
            for (var i = 0, il = animationDef.channels.length; i < il; i++) {
                var channel = animationDef.channels[i];
                var sampler = animationDef.samplers[channel.sampler];
                if (sampler) {
                    var target = channel.target;
                    var name = target.node !== undefined ? target.node : target.id; // NOTE: target.id is deprecated.
                    var input = animationDef.parameters !== undefined ? animationDef.parameters[sampler.input] : sampler.input;
                    var output = animationDef.parameters !== undefined ? animationDef.parameters[sampler.output] : sampler.output;
                    var inputAccessor = dependencies.accessors[input];
                    var outputAccessor = dependencies.accessors[output];
                    var node = dependencies.nodes[name];
                    if (node) {
                        node.updateMatrix();
                        node.matrixAutoUpdate = true;
                        var TypedKeyframeTrack;
                        switch (PATH_PROPERTIES[target.path]) {
                            case PATH_PROPERTIES.weights:
                                TypedKeyframeTrack = THREE.NumberKeyframeTrack;
                                break;
                            case PATH_PROPERTIES.rotation:
                                TypedKeyframeTrack = THREE.QuaternionKeyframeTrack;
                                break;
                            case PATH_PROPERTIES.position:
                            case PATH_PROPERTIES.scale:
                            default:
                                TypedKeyframeTrack = THREE.VectorKeyframeTrack;
                                break;
                        }
                        var targetName = node.name ? node.name : node.uuid;
                        var interpolation = sampler.interpolation !== undefined ? INTERPOLATION[sampler.interpolation] : THREE.InterpolateLinear;
                        var targetNames = [];
                        if (PATH_PROPERTIES[target.path] === PATH_PROPERTIES.weights) {
                            // node can be THREE.Group here but
                            // PATH_PROPERTIES.weights(morphTargetInfluences) should be
                            // the property of a mesh object under group.
                            node.traverse(function (object) {
                                if (object.isMesh === true && object.morphTargetInfluences) {
                                    targetNames.push(object.name ? object.name : object.uuid);
                                }
                            });
                        } else {
                            targetNames.push(targetName);
                        }
                        // KeyframeTrack.optimize() will modify given 'times' and 'values'
                        // buffers before creating a truncated copy to keep. Because buffers may
                        // be reused by other tracks, make copies here.
                        for (var j = 0, jl = targetNames.length; j < jl; j++) {
                            var track = new TypedKeyframeTrack(
                                targetNames[j] + '.' + PATH_PROPERTIES[target.path],
                                THREE.AnimationUtils.arraySlice(inputAccessor.array, 0),
                                THREE.AnimationUtils.arraySlice(outputAccessor.array, 0),
                                interpolation
                            );
                            // Here is the trick to enable custom interpolation.
                            // Overrides .createInterpolant in a factory method which creates custom interpolation.
                            if (sampler.interpolation === 'CUBICSPLINE') {
                                track.createInterpolant = function InterpolantFactoryMethodGLTFCubicSpline(result) {
                                    // A CUBICSPLINE keyframe in glTF has three output values for each input value,
                                    // representing inTangent, splineVertex, and outTangent. As a result, track.getValueSize()
                                    // must be divided by three to get the interpolant's sampleSize argument.
                                    return new GLTFCubicSplineInterpolant(this.times, this.values, this.getValueSize() / 3, result);
                                };
                                // Workaround, provide an alternate way to know if the interpolant type is cubis spline to track.
                                // track.getInterpolation() doesn't return valid value for custom interpolant.
                                track.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
                            }
                            tracks.push(track);
                        }
                    }
                }
            }
            var name = animationDef.name !== undefined ? animationDef.name : 'animation_' + animationIndex;
            return new THREE.AnimationClip(name, undefined, tracks);
        });
    };
}

/**
 * @param  {THREE.BufferGeometry} geometry
 * @param  {GLTF.Primitive} primitiveDef
 * @param  {Array<THREE.BufferAttribute>} accessors
 */
function addPrimitiveAttributes(geometry, primitiveDef, accessors) {
    var attributes = primitiveDef.attributes;
    for (var gltfAttributeName in attributes) {
        var threeAttributeName = ATTRIBUTES[gltfAttributeName];
        var bufferAttribute = accessors[attributes[gltfAttributeName]];
        // Skip attributes already provided by e.g. Draco extension.
        if (!threeAttributeName) continue;
        if (threeAttributeName in geometry.attributes) continue;
        geometry.addAttribute(threeAttributeName, bufferAttribute);
    }
    if (primitiveDef.indices !== undefined && !geometry.index) {
        geometry.setIndex(accessors[primitiveDef.indices]);
    }
    if (primitiveDef.targets !== undefined) {
        addMorphTargets(geometry, primitiveDef.targets, accessors);
    }
    assignExtrasToUserData(geometry, primitiveDef);
}

/* GLTFREGISTRY */
function GLTFRegistry() {
    var objects = {};
    return	{
        get: function ( key ) {
            return objects[ key ];
        },
        add: function ( key, object ) {
            objects[ key ] = object;
        },
        remove: function ( key ) {
            delete objects[ key ];
        },
        removeAll: function () {
            objects = {};
        }
    };
}
