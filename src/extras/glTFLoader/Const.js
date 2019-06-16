export const BRDF_LUT_URL = 'https://raw.githubusercontent.com/todaylg/LGL/master/examples/assets/images/brdfLUT.png';
export const WEBGL_TYPE_SIZES = {
    'SCALAR': 1,
    'VEC2': 2,
    'VEC3': 3,
    'VEC4': 4,
    'MAT2': 4,
    'MAT3': 9,
    'MAT4': 16
};

export const WEBGL_COMPONENT_TYPES = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
};

export const ALPHA_MODES = {
    OPAQUE: 'OPAQUE',
    MASK: 'MASK',
    BLEND: 'BLEND'
};


export const ATTRIBUTES = {
    POSITION: 'position',
    NORMAL: 'normal',
    TEXCOORD_0: 'uv',
    TANGENT: 'tangent',
    TEXCOORD0: 'uv', // deprecated
    TEXCOORD: 'uv', // deprecated
    TEXCOORD_1: 'uv2',
    COLOR_0: 'color',
    COLOR0: 'color', // deprecated
    COLOR: 'color', // deprecated
    WEIGHTS_0: 'skinWeight',
    WEIGHT: 'skinWeight', // deprecated
    JOINTS_0: 'skinIndex',
    JOINT: 'skinIndex' // deprecated
};

export const WEBGL_CONSTANTS = {
    FLOAT: 5126,
    //FLOAT_MAT2: 35674,
    FLOAT_MAT3: 35675,
    FLOAT_MAT4: 35676,
    FLOAT_VEC2: 35664,
    FLOAT_VEC3: 35665,
    FLOAT_VEC4: 35666,
    LINEAR: 9729,
    REPEAT: 10497,
    SAMPLER_2D: 35678,
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
    UNSIGNED_BYTE: 5121,
    UNSIGNED_SHORT: 5123
};

export const PATH_PROPERTIES = {
    scale: 'scale',
    translation: 'position',
    rotation: 'quaternion',
    weights: 'morphTargetInfluences'
};

export const MIME_TYPE_FORMATS = {
    'image/png': 1023,
    'image/jpeg': 1022
};

//Todo
export const EXTENSIONS = {
    KHR_BINARY_GLTF: 'KHR_binary_glTF',
    KHR_DRACO_MESH_COMPRESSION: 'KHR_draco_mesh_compression',
    KHR_LIGHTS_PUNCTUAL: 'KHR_lights_punctual',
    KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS: 'KHR_materials_pbrSpecularGlossiness',
    KHR_MATERIALS_UNLIT: 'KHR_materials_unlit',
    MSFT_TEXTURE_DDS: 'MSFT_texture_dds'
};