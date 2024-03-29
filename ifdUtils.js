const { getTiffTagNameByNumber } = require('./tagUtils');
const { ASCII, SHORT, BYTE, LONG } = require('./types');
const {
	readAscii,
	readShort,
	readLong,
	readByte,
	readAsciiBuffer,
	readShortBuffer,
	readLongBuffer,
	readByteBuffer,
	getTypeNameByNumber,
} = require('./typeUtils');
const { SubIFDs } = require('./tiffTags');

function getType(buffer, endianness, ifdEntryOffset) {
	return readShort(buffer, endianness, ifdEntryOffset + 2);
}

function getTag(buffer, endianness, ifdEntryOffset) {
	return readShort(buffer, endianness, ifdEntryOffset);
}

function getCount(buffer, endianness, ifdEntryOffset) {
	return readLong(buffer, endianness, ifdEntryOffset + 4);
}

function getValue(buffer, endianness, ifdEntryOffset) {
	const count = getCount(buffer, endianness, ifdEntryOffset);
	const type = getType(buffer, endianness, ifdEntryOffset);
	const offsetOrValue = readLong(buffer, endianness, ifdEntryOffset + 8);

	if (count === 1) {
		switch (type) {
			case ASCII:
				return readAscii(buffer, endianness, ifdEntryOffset + 8);
			case SHORT:
				return readShort(buffer, endianness, ifdEntryOffset + 8);
			case LONG:
				return readLong(buffer, endianness, ifdEntryOffset + 8);
			case BYTE:
				return readByte(buffer, endianness, ifdEntryOffset + 8);
		}

		return offsetOrValue;
	} else {
		switch (type) {
			case ASCII:
				return readAsciiBuffer(
					buffer,
					endianness,
					offsetOrValue,
					count
				);
			case SHORT:
				return readShortBuffer(
					buffer,
					endianness,
					offsetOrValue,
					count
				);
			case LONG:
				return readLongBuffer(buffer, endianness, offsetOrValue, count);
			case BYTE:
				return readByteBuffer(buffer, endianness, offsetOrValue, count);
		}
	}

	return [];
}

function parseIfdEntry(buffer, endianness, ifdEntryOffset) {
	const type = getType(buffer, endianness, ifdEntryOffset);
	const tag = getTag(buffer, endianness, ifdEntryOffset);
	const count = getCount(buffer, endianness, ifdEntryOffset);
	const value = getValue(buffer, endianness, ifdEntryOffset);

	return { tag, type, count, value };
}

function parseIfdEntries(buffer, endianness, ifdOffset) {
	const ifdEntryOffsets = getIfdEntryOffsets(buffer, endianness, ifdOffset);

	return ifdEntryOffsets.map(function(ifdEntryOffset) {
		return parseIfdEntry(buffer, endianness, ifdEntryOffset);
	});
}

function getHumanReadableIfdEntry(buffer, endianness, ifdEntryOffset) {
	const { type, tag, count, value } = parseIfdEntry(
		buffer,
		endianness,
		ifdEntryOffset
	);

	return {
		offset: ifdEntryOffset,
		tag: getTiffTagNameByNumber(tag),
		type: getTypeNameByNumber(type),
		value,
	};
}

function getHumanReadableIfdEntries(buffer, endianness, ifdOffset) {
	const ifdEntryOffsets = getIfdEntryOffsets(buffer, endianness, ifdOffset);

	return ifdEntryOffsets.map(function(ifdEntryOffset) {
		return getHumanReadableIfdEntry(buffer, endianness, ifdEntryOffset);
	});
}

function getIfdEntry(buffer, endianness, ifdEntryOffset) {
	return buffer.slice(ifdEntryOffset, ifdEntryOffset + 12);
}

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

function getIfdEntryByTag(buffer, endianness, ifdOffset, tag) {
	const ifdEntries = parseIfdEntries(buffer, endianness, ifdOffset);
	return ifdEntries.filter(function(entry) {
		return entry.tag === tag;
	})[0];
}

function getSubIfds(buffer, endianness, ifdOffset) {
	const { value } = getIfdEntryByTag(
		buffer,
		endianness,
		ifdOffset,
		SubIFDs.tag
	);
	return value;
}

module.exports = {
	getIfdSize,
	getNextIfdOffset,
	getIfdEntryOffsets,
	parseIfdEntry,
	parseIfdEntries,
	getHumanReadableIfdEntry,
	getHumanReadableIfdEntries,
	getIfdEntry,
	getIfdEntryByTag,
	getSubIfds,
};
