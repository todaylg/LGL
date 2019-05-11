export class BufferAttribute {
	constructor(array, itemSize, normalized){
		this.name = '';
		this.isBufferAttribute = true;
		this.array = array;
		this.itemSize = itemSize;
		this.count = array !== undefined ? array.length / itemSize : 0;
		this.normalized = normalized === true;
		this.dynamic = false;
		this.updateRange = { offset: 0, count: - 1 };
	}
	setArray(array){
		this.count = array !== undefined ? array.length / this.itemSize : 0;
		this.array = array;
		return this;
	}
	set(value, offset) {
		if ( offset === undefined ) offset = 0;
		this.array.set( value, offset );
		return this;
	}
	getX(index){
		return this.array[ index * this.itemSize ];
	}
	setX(index, x){
		this.array[ index * this.itemSize ] = x;
		return this;
	}
	getY(index){
		return this.array[ index * this.itemSize + 1 ];
	}
	setY(index, y){
		this.array[ index * this.itemSize + 1 ] = y;
		return this;
	}
	getZ(index){
		return this.array[ index * this.itemSize + 2 ];
	}
	setZ(index, z){
		this.array[ index * this.itemSize + 2 ] = z;
		return this;
	}
	getW(index){
		return this.array[ index * this.itemSize + 3 ];
	}
	setW(index, w){
		this.array[ index * this.itemSize + 3 ] = w;
		return this;
	}
	setXY(index, x, y){
		index *= this.itemSize;
		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		return this;
	}
	setXYZ(index, x, y, z){
		index *= this.itemSize;
		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		return this;
	}
	setXYZW(index, x, y, z, w){
		index *= this.itemSize;
		this.array[ index + 0 ] = x;
		this.array[ index + 1 ] = y;
		this.array[ index + 2 ] = z;
		this.array[ index + 3 ] = w;
		return this;
	}
	clone(){
		return new this.constructor( this.array, this.itemSize ).copy( this );
	}
}
