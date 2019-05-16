export class BufferAttribute {
	constructor(array, itemSize, normalized){
		this.data = array;
		this.size = itemSize;
		this.count = array !== undefined ? array.length / itemSize : 0;
		this.normalize = normalized === true;
	}

	setArray(array){
		this.count = array !== undefined ? array.length / this.itemSize : 0;
		this.data = array;
		return this;
	}

	set(value, offset) {
		if ( offset === undefined ) offset = 0;
		this.data.set( value, offset );
		return this;
	}

	getX(index){
		return this.data[ index * this.itemSize ];
	}

	setX(index, x){
		this.data[ index * this.itemSize ] = x;
		return this;
	}

	getY(index){
		return this.data[ index * this.itemSize + 1 ];
	}

	setY(index, y){
		this.data[ index * this.itemSize + 1 ] = y;
		return this;
	}

	getZ(index){
		return this.data[ index * this.itemSize + 2 ];
	}

	setZ(index, z){
		this.data[ index * this.itemSize + 2 ] = z;
		return this;
	}

	getW(index){
		return this.data[ index * this.itemSize + 3 ];
	}

	setW(index, w){
		this.data[ index * this.itemSize + 3 ] = w;
		return this;
	}

	setXY(index, x, y){
		index *= this.itemSize;
		this.data[ index + 0 ] = x;
		this.data[ index + 1 ] = y;
		return this;
	}

	setXYZ(index, x, y, z){
		index *= this.itemSize;
		this.data[ index + 0 ] = x;
		this.data[ index + 1 ] = y;
		this.data[ index + 2 ] = z;
		return this;
	}

	setXYZW(index, x, y, z, w){
		index *= this.itemSize;
		this.data[ index + 0 ] = x;
		this.data[ index + 1 ] = y;
		this.data[ index + 2 ] = z;
		this.data[ index + 3 ] = w;
		return this;
	}

	clone(){
		return new this.constructor( this.data, this.itemSize ).copy( this );
	}
}
