const { readLong, readShort } = require('./typeUtils');

function getIfdSize(buffer, endianness, ifdOffset) {
	return readShort(buffer, endianness, ifdOffset);
}

function getNextIfdOffset(buffer, endianness, ifdOffset) {
	const offset =
		ifdOffset + 2 + getIfdSize(buffer, endianness, ifdOffset) * 12;
	return readLong(buffer, endianness, offset);
}

function getIfdEntryOffsets(buffer, endianness, ifdOffset) {
	const size = getIfdSize(buffer, endianness, ifdOffset);
	const offsets = [];

	for (let i = 0; i < size * 12; i += 12) {
		offsets.push(ifdOffset + 2 + i);
	}

	return offsets;
}

module.exports = {
	getIfdSize,
	getNextIfdOffset,
	getIfdEntryOffsets,
};
