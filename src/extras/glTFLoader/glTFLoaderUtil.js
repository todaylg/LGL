import { Mat4 } from '/src/math/Mat4.js';

export const EXTENSIONS = {
	KHR_BINARY_GLTF: 'KHR_binary_glTF',
	KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
	KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
	KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
	KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
	MSFT_TEXTURE_DDS: 'MSFT_texture_dds'
};

export const BINARY_EXTENSION_BUFFER_NAME = 'binary_glTF';
export const BINARY_EXTENSION_HEADER_MAGIC = 'glTF';
export const BINARY_EXTENSION_HEADER_LENGTH = 12;
export const BINARY_EXTENSION_CHUNK_TYPES = { JSON: 0x4E4F534A, BIN: 0x004E4942 };

export function extractUrlBase(url) {
	let index = url.lastIndexOf('/');
	if (index === - 1) return './';
	return url.substr(0, index + 1);
}

export function decodeText(array) {
	if (typeof TextDecoder !== 'undefined') {
		return new TextDecoder().decode(array);
	} else {
		console.error("no TextDecoder support");
	}
}
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export function degToRad(degrees) {
	return degrees * DEG2RAD;
}

export function radToDeg(radians) {
	return radians * RAD2DEG;
}
/* Extension */

/**
 * glb Extension
 */
export function GLTFBinaryExtension(data) {
	this.name = EXTENSIONS.KHR_BINARY_GLTF;
	this.content = null;
	this.body = null;

	let headerView = new DataView(data, 0, BINARY_EXTENSION_HEADER_LENGTH);

	this.header = {
		magic: decodeText(new Uint8Array(data.slice(0, 4))),
		version: headerView.getUint32(4, true),
		length: headerView.getUint32(8, true)
	};

	if (this.header.magic !== BINARY_EXTENSION_HEADER_MAGIC) {
		throw new Error('GLTFLoader: Unsupported glTF-Binary header.');
	} else if (this.header.version < 2.0) {
		throw new Error('GLTFLoader: Unsupported glTF version below 2.0');
	}

	let chunkView = new DataView(data, BINARY_EXTENSION_HEADER_LENGTH);
	let chunkIndex = 0;

	while (chunkIndex < chunkView.byteLength) {
		let chunkLength = chunkView.getUint32(chunkIndex, true);
		chunkIndex += 4;

		let chunkType = chunkView.getUint32(chunkIndex, true);
		chunkIndex += 4;

		if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.JSON) {
			let contentArray = new Uint8Array(data, BINARY_EXTENSION_HEADER_LENGTH + chunkIndex, chunkLength);
			this.content = decodeText(contentArray);
		} else if (chunkType === BINARY_EXTENSION_CHUNK_TYPES.BIN) {
			let byteOffset = BINARY_EXTENSION_HEADER_LENGTH + chunkIndex;
			this.body = data.slice(byteOffset, byteOffset + chunkLength);
		}
		// Clients must ignore chunks with unknown types.
		chunkIndex += chunkLength;
	}
	if (this.content === null) {
		throw new Error('GLTFLoader: JSON content not found.');
	}
}

export function addUnknownExtensionsToUserData(knownExtensions, object, objectDef) {
	// Add unknown glTF extensions to an object's userData.
	for (var name in objectDef.extensions) {
		if (knownExtensions[name] === undefined) {
			object.userData.gltfExtensions = object.userData.gltfExtensions || {};
			object.userData.gltfExtensions[name] = objectDef.extensions[name];
		}
	}
}

/**
 * @param {THREE.Object3D|THREE.Material|THREE.BufferGeometry} object
 * @param {GLTF.definition} def
 */
export function assignExtrasToUserData(object, gltfDef) {
	if (gltfDef.extras !== undefined) {
		if (typeof gltfDef.extras === 'object') {
			object.userData = gltfDef.extras;
		} else {
			console.warn('GLTFLoader: Ignoring primitive type .extras, ' + gltfDef.extras);
		}
	}
}


export function Skeleton(bones, boneInverses) {
	// copy the bone array
	bones = bones || [];
	this.bones = bones.slice(0);
	this.boneMatrices = new Float32Array(this.bones.length * 16);
	// use the supplied bone inverses or calculate the inverses
	if (boneInverses === undefined) {
		this.calculateInverses();
	} else {
		if (this.bones.length === boneInverses.length) {
			this.boneInverses = boneInverses.slice(0);
		} else {
			console.warn('Skeleton boneInverses is the wrong length.');
			this.boneInverses = [];
			for (var i = 0, il = this.bones.length; i < il; i++) {
				this.boneInverses.push(new Mat4());
			}
		}
	}
}

Object.assign(Skeleton.prototype, {
	calculateInverses: function () {
		this.boneInverses = [];
		for (var i = 0, il = this.bones.length; i < il; i++) {
			var inverse = new Mat4();
			if (this.bones[i]) {
				inverse.getInverse(this.bones[i].matrixWorld);
			}
			this.boneInverses.push(inverse);
		}
	},
	pose: function () {
		var bone, i, il;
		// recover the bind-time world matrices
		for (i = 0, il = this.bones.length; i < il; i++) {
			bone = this.bones[i];
			if (bone) {
				bone.matrixWorld.getInverse(this.boneInverses[i]);
			}
		}

		// compute the local matrices, positions, rotations and scales
		for (i = 0, il = this.bones.length; i < il; i++) {
			bone = this.bones[i];
			if (bone) {
				if (bone.parent && bone.parent.isBone) {
					bone.matrix.getInverse(bone.parent.matrixWorld);
					bone.matrix.multiply(bone.matrixWorld);
				} else {
					bone.matrix.copy(bone.matrixWorld);
				}
				bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);
			}
		}
	},

	update: (function () {
		var offsetMatrix = new Mat4();
		var identityMatrix = new Mat4();
		return function update() {
			var bones = this.bones;
			var boneInverses = this.boneInverses;
			var boneMatrices = this.boneMatrices;
			var boneTexture = this.boneTexture;
			// flatten bone matrices to array
			for (var i = 0, il = bones.length; i < il; i++) {
				// compute the offset between the current and the original transform
				var matrix = bones[i] ? bones[i].matrixWorld : identityMatrix;
				offsetMatrix.multiplyMatrices(matrix, boneInverses[i]);
				offsetMatrix.toArray(boneMatrices, i * 16);
			}
			if (boneTexture !== undefined) {
				boneTexture.needsUpdate = true;
			}
		};
	})(),
	clone: function () {
		return new Skeleton(this.bones, this.boneInverses);
	},

	getBoneByName: function (name) {
		for (var i = 0, il = this.bones.length; i < il; i++) {
			var bone = this.bones[i];
			if (bone.name === name) {
				return bone;
			}
		}
		return undefined;
	}
});


