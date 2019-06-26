function pack(endianness, ...bytes) {
	return (
		((bytes[0] & 0xff) << 24) |
		((bytes[1] & 0xff) << 16) |
		((bytes[2] & 0xff) << 8) |
		((bytes[3] & 0xff) << 0)
	);
}

function getFirstIfdOffset(buffer, endianness) {
	return pack(endianness, buffer[4], buffer[5], buffer[6], buffer[7]);
}

function getIfdSize(buffer, endianness, ifdOffset) {
	return pack(endianness, 0, 0, buffer[ifdOffset + 0], buffer[ifdOffset + 1]);
}

function getNextIfdOffset(buffer, endianness, ifdOffset) {
	const offset =
		ifdOffset + 2 + getIfdSize(buffer, endianness, ifdOffset) * 12;
	return pack(
		endianness,
		buffer[offset],
		buffer[offset + 1],
		buffer[offset + 2],
		buffer[offset + 3]
	);
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

function getIfdEntryOffsets(buffer, endianness, ifdOffset) {
	const size = getIfdSize(buffer, endianness, ifdOffset);
	const offsets = [];

	for (let i = 0; i < size * 12; i += 12) {
		offsets.push(ifdOffset + 2 + i);
	}

	return offsets;
}

function getIfdEntry(buffer, endianness, ifdEntryOffset) {
	return buffer.slice(ifdEntryOffset, ifdEntryOffset + 12);
}

// function getIfdEntries(buffer, endianness, ifdOffset) {
// 	const ifdEntryOffsets = getIfdEntryOffsets(buffer, endianness, ifdOffset);

// 	return ifdEntryOffsets.map(function(ifdEntryOffset) {
// 		return getIfdEntry(buffer, endianness, ifdEntryOffset);
// 	});
// }

function parseIfdEntry(buffer, endianness, ifdEntryOffset) {
	const tag = pack(
		endianness,
		0,
		0,
		buffer[ifdEntryOffset],
		buffer[ifdEntryOffset + 1]
	);
	const type = pack(
		endianness,
		0,
		0,
		buffer[ifdEntryOffset + 2],
		buffer[ifdEntryOffset + 3]
	);
	const count = pack(
		endianness,
		buffer[ifdEntryOffset + 4],
		buffer[ifdEntryOffset + 5],
		buffer[ifdEntryOffset + 6],
		buffer[ifdEntryOffset + 7]
	);
	const value = pack(
		endianness,
		buffer[ifdEntryOffset + 8],
		buffer[ifdEntryOffset + 9],
		buffer[ifdEntryOffset + 10],
		buffer[ifdEntryOffset + 11]
	);

	return { offset: ifdEntryOffset, tag, type, count, value };
}

function parseIfdEntries(buffer, endianness, ifdOffset) {
	const ifdEntryOffsets = getIfdEntryOffsets(buffer, endianness, ifdOffset);

	return ifdEntryOffsets.map(function(ifdEntryOffset) {
		return parseIfdEntry(buffer, endianness, ifdEntryOffset);
	});
}

module.exports = {
	pack,
	getFirstIfdOffset,
	getIfdSize,
	getNextIfdOffset,
	getIfdOffsets,
	getIfdEntryOffsets,
	//getIfdEntries,
	getIfdEntry,
	parseIfdEntry,
	parseIfdEntries,
};
