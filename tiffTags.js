const { LONG, SHORT } = require('./ifdEntryTypes');

/**
 * Replaces the old SubfileType field, due to limitations in the definition of
 * that field.
 * NewSubfileType is mainly useful when there are multiple subfiles in a single
 * TIFF file.
 * This field is made up of a set of 32 flag bits. Unused bits are expected to
 * be 0. Bit 0 is the low-order bit.
 * Currently defined values are:
 *
 * Bit 0 is 1 if the image is a reduced-resolution version of another image in
 * this TIFF file; else the bit is 0.
 *
 * Bit 1 is 1 if the image is a single page of a multi-page image (see the
 * PageNumber field description); else the bit is 0.
 *
 * Bit 2 is 1 if the image defines a transparency mask for another image in
 * this TIFF file. The PhotometricInterpretation value must be 4,
 * designating a transparency mask.
 *
 * These values are defined as bit flags because they are independent of each other.
 * Default is 0.
 */
const NewSubfileType = {
	tag: 254,
	type: LONG,
	count: 1,
};

/**
 * The number of columns in the image, i.e., the number of pixels per row.
 */
const ImageWidth = {
	tag: 256,
	type: [SHORT, LONG],
	count: undefined,
	comment: 'The number of pixels per row.',
};

/**
 * The number of rows of pixels in the image.
 */
const ImageLength = {
	tag: 257,
	type: [SHORT, LONG],
	count: undefined,
	comment: 'The number of rows of pixels in the image.',
};

const BitsPerSample = {
	tag: 258,
	type: SHORT,
	count: undefined,
};

const Compression = {
	tag: 259,
	type: SHORT,
	count: undefined,
};

const PhotometricInterpretation = {
	tag: 262,
	type: SHORT,
	count: undefined,
};

/**
 * Manufacturer of the scanner, video digitizer, or other type of equipment
 * used to generate the image. Synthetic images should not include this field.
 * See also Model, Software.
 */
const Make = {
	tag: 271,
	type: ASCII,
	count: undefined,
	comment: 'The scanner manufacturer.',
};

module.exports = {
	NewSubfileType,
	ImageWidth,
	ImageLength,
};
