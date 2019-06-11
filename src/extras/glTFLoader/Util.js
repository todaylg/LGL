export function extractUrlBase(url) {
	let index = url.lastIndexOf('/');
	if (index === - 1) return './';
	return url.substr(0, index + 1); //Get assets folder url
}

export function decodeText(array) {
	if (typeof TextDecoder !== 'undefined') {
		return new TextDecoder().decode(array);
	} else {
		console.error("no TextDecoder support");
	}
}

//Todo
export function GLTFRegistry() {
    let objects = {};
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
        },
        getAll:function () {
            return objects;
        },
    };
}

export function resolveURL( url, path ) {
    // Invalid URL
    if ( typeof url !== 'string' || url === '' ) return '';
    // Absolute URL http://,https://,//
    if ( /^(https?:)?\/\//i.test( url ) ) return url;
    // Data URI
    if ( /^data:.*,.*$/i.test( url ) ) return url;
    // Blob URL
    if ( /^blob:.*$/i.test( url ) ) return url;
    // Relative URL
    return path + url;
}

export function definesToString(defines) {
    let outStr = '';
    for (let def in defines) {
        outStr += '#define ' + def + ' ' + defines[def] + '\n';
    }
    return outStr;
};

export function sliceBlockData(frameData) {
    let blocks = [];
    let { count, size, data } = frameData;
    for (let i = 0; i < count; i++) {
        let offset = i * size;
        blocks.push(data.slice(offset, offset + size));
    }
    return blocks;
}

//Load .glb (Todo)
export class GLTFBinaryExtension{
    constructor(data){
        this.content = null;
        this.body = null;
        let headerLength = 12;
        let headerView = new DataView( data, 0, headerLength );
        this.header = {
            magic: decodeText( new Uint8Array( data.slice( 0, 4 ) ) ),
            version: headerView.getUint32( 4, true ),
            length: headerView.getUint32( 8, true )
        };
        if ( this.header.magic !== 'glTF' ) {
			throw new Error( 'Unsupported glTF-Binary header.' );
		} else if ( this.header.version < 2.0 ) {
			throw new Error( 'Unsupported version below 2.0.' );
        }
        let chunkView = new DataView( data, headerLength );
        let chunkIndex = 0;
        let chunkTypeDef = { JSON: 0x4E4F534A, BIN: 0x004E4942 };
		while ( chunkIndex < chunkView.byteLength ) {
			let chunkLength = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;
			let chunkType = chunkView.getUint32( chunkIndex, true );
			chunkIndex += 4;
			if ( chunkType === chunkTypeDef.JSON ) {
				let contentArray = new Uint8Array( data, headerLength + chunkIndex, chunkLength );
				this.content = decodeText( contentArray );
			} else if ( chunkType === chunkTypeDef.BIN ) {
				let byteOffset = headerLength + chunkIndex;
				this.body = data.slice( byteOffset, byteOffset + chunkLength );
			}
			// Clients must ignore chunks with unknown types.
			chunkIndex += chunkLength;
		}
		if ( this.content === null ) {
			throw new Error( 'JSON content not found.' );
		}
    }
}

export function isPrimitiveEqual( a, b ) {
    if ( a.indices !== b.indices ) {
        return false;
    }
    return isObjectEqual( a.attributes, b.attributes );
}

export function isObjectEqual( a, b ) {
    if ( Object.keys( a ).length !== Object.keys( b ).length ) return false;
    for ( let key in a ) {
        if ( a[ key ] !== b[ key ] ) return false;
    }
    return true;
}

export function isArrayEqual( a, b ) {
    if ( a.length !== b.length ) return false;
    for ( let i = 0, il = a.length; i < il; i ++ ) {
        if ( a[ i ] !== b[ i ] ) return false;
    }
    return true;
}
