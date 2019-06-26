const { BYTE, ASCII, SRATIONAL, RATIONAL, SHORT } = require('./ifdEntryTypes');

const DNGVersion = {
	tag: 50706,
	type: BYTE,
	count: 4,
};

const DNGBackwardVersion = {
	tag: 50707,
	type: BYTE,
	count: 4,
};

const UniqueCameraModel = {
	tag: 50708,
	type: ASCII,
	count: undefined,
};

const ColorMatrix1 = {
	tag: 50721,
	type: SRATIONAL,
	count: undefined,
};

const AsShotWhiteXY = {
	tag: 50729,
	type: RATIONAL,
	count: 2,
};

const MakerNoteSafety = {
	tag: 50741,
	type: SHORT,
	count: 1,
};

/**
 * This tag is an MD5 digest of the raw image data. All pixels in the image are
 * processed in row scan order. Each pixel is zero padded to 16 or 32 bits deep
 * (16-bit for data less than or equal to 16 bits deep, 32-bit otherwise).
 * The data for each pixel is processed in little-endian byte order.
 */
const RawImageDigest = {
	tag: 50972,
	type: BYTE,
	count: 16,
};

module.exports = {
	DNGVersion,
	DNGBackwardVersion,
	UniqueCameraModel,
	ColorMatrix1,
	AsShotWhiteXY,
	MakerNoteSafety,
	RawImageDigest,
};
