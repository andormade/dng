const types = require('./types');

function pack(endianness, ...bytes) {
	return (
		((bytes[0] & 0xff) << 24) |
		((bytes[1] & 0xff) << 16) |
		((bytes[2] & 0xff) << 8) |
		((bytes[3] & 0xff) << 0)
	);
}

function unpack(endianness, number) {
	const bytes = [];
	while (number > 0) {
		bytes.unshift(number & 0xff);
		number >>= 8;
	}

	while (bytes.length < 4) {
		bytes.unshift(0);
	}

	return bytes;
}

function readByte(buffer, endianness, offset) {
	return pack(endianness, 0, 0, 0, buffer[offset]);
}

function readShort(buffer, endianness, offset) {
	return pack(endianness, 0, 0, buffer[offset], buffer[offset + 1]);
}

function readLong(buffer, endianness, offset) {
	return pack(
		endianness,
		buffer[offset],
		buffer[offset + 1],
		buffer[offset + 2],
		buffer[offset + 3]
	);
}

function readAscii(buffer, endianness, offset) {
	return String.fromCharCode(buffer[offset]);
}

function readWordString(
	buffer,
	endianness,
	offset,
	wordLength,
	count,
	callback
) {
	const inarr = buffer.slice(offset, offset + count * wordLength);

	let out = [];

	for (let i = 0; i < inarr.length; i += wordLength) {
		out.push(callback(buffer, endianness, offset + i));
	}

	return out;
}

function readByteBuffer(buffer, endianness, offset, count) {
	return readWordString(buffer, endianness, offset, 1, count, readByte);
}

function readAsciiBuffer(buffer, endianness, offset, count) {
	const valueBuffer = buffer.slice(offset, offset + count - 1);
	let value = '';

	for (let i = 0; i < valueBuffer.length; i++) {
		value += readAscii(buffer, endianness, offset + i);
	}

	return value;
}

function readShortBuffer(buffer, endianness, offset, count) {
	return readWordString(buffer, endianness, offset, 2, count, readShort);
}

function readLongBuffer(buffer, endianness, offset, count) {
	return readWordString(buffer, endianness, offset, 4, count, readLong);
}

function getTypeNameByNumber(number) {
	const [type = number] = Object.keys(types).filter(function(type) {
		return types[type] === number;
	});

	return type;
}

module.exports = {
	readAscii,
	readShort,
	readLong,
	readByte,
	readAsciiBuffer,
	readShortBuffer,
	readLongBuffer,
	readByteBuffer,
	getTypeNameByNumber,
	unpack,
	pack,
};
