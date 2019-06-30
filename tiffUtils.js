const BIG_ENDIAN = Symbol('BIG_ENDIAN');
const LITTLE_ENDIAN = Symbol('LITTLE_ENDIAN');
const { getIfdSize, getNextIfdOffset } = require('./ifdUtils');
const { readLong } = require('./typeUtils');

function getEndianness(buffer) {
	if (buffer[0] === 0x4d && buffer[1] === 0x4d) {
		return BIG_ENDIAN;
	} else if (buffer[0] === 0x00 && buffer[0] === 0x00) {
		return LITTLE_ENDIAN;
	} else {
		throw 'Not valid TIFF file';
	}
}

function isValidTiffFile(buffer) {
	if (getEndianness(buffer) === BIG_ENDIAN) {
		return buffer[3] === 0x2a;
	} else {
		return buffer[3] === 0x2a;
	}
}

function getFirstIfdOffset(buffer, endianness) {
	return readLong(buffer, endianness, 4);
}

function getIfdOffsets(buffer, endianness) {
	let ifdOffset = getFirstIfdOffset(buffer);
	const ifdOffsets = [ifdOffset];

	console.log(
		ifdOffsets.length,
		'offset:',
		ifdOffset,
		'size:',
		getIfdSize(buffer, endianness, ifdOffset)
	);

	while ((ifdOffset = getNextIfdOffset(buffer, endianness, ifdOffset))) {
		ifdOffsets.push(ifdOffset);
		console.log(
			ifdOffsets.length,
			'offset:',
			ifdOffset,
			'size:',
			getIfdSize(buffer, endianness, ifdOffset)
		);

		if (ifdOffset >= buffer.length) {
			break;
		}
	}

	return ifdOffsets;
}

function getSubIfdOffsets(buffer, endianness, ifdOffset) {}

module.exports = {
	getFirstIfdOffset,
	getIfdOffsets,
};
