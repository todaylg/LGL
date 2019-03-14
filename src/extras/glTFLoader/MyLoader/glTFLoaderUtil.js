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
        }
    };
}