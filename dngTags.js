const {
	BYTE,
	ASCII,
	SRATIONAL,
	RATIONAL,
	SHORT,
	LONG,
} = require('./ifdEntryTypes');

/**
 * This tag encodes the DNG four-tier version number. For files compliant with
 * this version of the DNG specification (1.4.0.0), this tag should contain
 * the bytes: 1, 4, 0, 0.
 */
const DNGVersion = {
	tag: 50706,
	type: BYTE,
	count: 4,
};

/**
 * This tag specifies the oldest version of the Digital Negative specification
 * for which a file is compatible. Readers should not attempt to read a file
 * if this tag specifies a version number that is higher than the version
 * number of the specification the reader was based on.
 *
 * In addition to checking the version tags, readers should, for all tags,
 * check the types, counts, and values, to verify it is able to correctly read
 * the file.
 */
const DNGBackwardVersion = {
	tag: 50707,
	type: BYTE,
	count: 4,
};

/**
 * UniqueCameraModel defines a unique, non-localized name for the camera model
 * that created the image in the raw file. This name should include the
 * manufacturer's name to avoid conflicts, and should not be localized, even if
 * the camera name itself is localized for different markets
 * (see LocalizedCameraModel).
 *
 * This string may be used by reader software to index into per-model
 * preferences and replacement profiles.
 */
const UniqueCameraModel = {
	tag: 50708,
	type: ASCII,
};

/**
 * Similar to the UniqueCameraModel field, except the name can be localized for
 * different markets to match the localization of the camera name.
 */
const LocalizedCameraModel = {
	tag: 50709,
	type: BYTE,
};

/**
 * CFAPlaneColor provides a mapping between the values in the CFAPattern tag
 * and the plane numbers in LinearRaw space. This is a required tag for non-RGB
 * CFA images.
 */
const CFAPlaneColor = {
	tag: 50710,
	type: BYTE,
};

/**
 * CFALayout describes the spatial layout of the CFA. The currently defined
 * values are:
 *
 * 1 = Rectangular (or square) layout
 * 2 = Staggered layout A: even columns are offset down by 1/2 row
 * 3 = Staggered layout B: even columns are offset up by 1/2 row
 * 4 = Staggered layout C: even rows are offset right by 1/2 column
 * 5 = Staggered layout D: even rows are offset left by 1/2 column
 * 6 = Staggered layout E: even rows are offset up by 1/2 row, even columns are
 * offset left by 1/2 column
 * 7 = Staggered layout F: even rows are offset up by 1/2 row, even columns are
 * offset right by 1/2 column
 * 8 = Staggered layout G: even rows are offset down by 1/2 row, even columns
 * are offset left by 1/2 column
 * 9 = Staggered layout H: even rows are offset down by 1/2 row, even columns
 * are offset right by 1/2 column
 *
 * Note that for the purposes of this tag, rows and columns are numbered
 * starting with one.
 * Layout values 6 through 9 were added with DNG version 1.3.0.0.
 */
const CFALayout = {
	tag: 50711,
	type: SHORT,
	count: 1,
	default: 1,
};

/**
 * LinearizationTable describes a lookup table that maps stored values into
 * linear values. This tag is typically used to increase compression ratios by
 * storing the raw data in a non-linear, more visually uniform space with fewer
 * total encoding levels.
 *
 * If SamplesPerPixel is not equal to one, this single table applies to all the
 * samples for each pixel.
 */
const LinearizationTable = {
	tag: 50712,
	type: SHORT,
};

/**
 * This tag specifies repeat pattern size for the BlackLevel tag.
 *
 * Value 0: BlackLevelRepeatRows
 * Value 1: BlackLevelRepeatCols
 */
const BlackLevelRepeatDim = {
	tag: 50713,
	type: SHORT,
	count: 2,
	default: [1, 1],
};

/**
 * This tag specifies the zero light (a.k.a. thermal black or black current)
 * encoding level, as a repeating pattern. The origin of this pattern is the
 * top-left corner of the ActiveArea rectangle. The values are stored in
 * row-column-sample scan order.
 *
 * See Chapter 5, “Mapping Raw Values to Linear Reference Values” on page 77
 * for details of the processing model.
 */
const BlackLevel = {
	tag: 50714,
	type: [SHORT, LONG, RATIONAL],
	count: (BlackLevelRepeatRows, BlackLevelRepeatCols, SamplesPerPixel) =>
		BlackLevelRepeatRows * BlackLevelRepeatCols * SamplesPerPixel,
	default: 0,
};

/**
 * If the zero light encoding level is a function of the image column,
 * BlackLevelDeltaH specifies the difference between the zero light encoding
 * level for each column and the baseline zero light encoding level.
 *
 * If SamplesPerPixel is not equal to one, this single table applies to all the
 * samples for each pixel.
 *
 * See Chapter 5, “Mapping Raw Values to Linear Reference Values” on page 77
 * for details of the processing model.
 */
const BlackLevelDeltaH = {
	tag: 50715,
	type: SRATIONAL,
	default: 0,
};

/**
 * If the zero light encoding level is a function of the image row, this tag
 * specifies the difference between the zero light encoding level for each row
 * and the baseline zero light encoding level.
 *
 * If SamplesPerPixel is not equal to one, this single table applies to all the
 * samples for each pixel.
 *
 * See Chapter 5, “Mapping Raw Values to Linear Reference Values” on page 77
 * for details of the processing model.
 */
const BlackLevelDeltaV = {
	tag: 50716,
	type: SRATIONAL,
	default: 0,
};

/**
 * This tag specifies the fully saturated encoding level for the raw sample
 * values. Saturation is caused either by the sensor itself becoming highly
 * non-linear in response, or by the camera's analog to digital converter
 * clipping.
 *
 * The default value for this tag is (2 ** BitsPerSample) -1 for unsigned
 * integer images, and 1.0 for floating point images.
 *
 * See Chapter 5, “Mapping Raw Values to Linear Reference Values” on page 77
 * for details of the processing model.
 */
const WhiteLevel = {
	tag: 50717,
	type: [SHORT, LONG],
	count: SamplesPerPixel => SamplesPerPixel,
	default: BitsPerSample => Math.pow(2, BitsPerSample),
};

/**
 * DefaultScale is required for cameras with non-square pixels. It specifies
 * the default scale factors for each direction to convert the image to square
 * pixels. Typically these factors are selected to approximately preserve total
 * pixel count.
 *
 * For CFA images that use CFALayout equal to 2, 3, 4, or 5, such as the
 * Fujifilm SuperCCD, these two values should usually differ by a factor of
 * 2.0.
 *
 * Value 0: DefaultScaleH
 * Value 1: DefaultScaleV
 */
const DefaultScale = {
	tag: 50718,
	type: RATIONAL,
	count: 2,
	default: [1.0, 1.0],
};

/**
 * Raw images often store extra pixels around the edges of the final image.
 * These extra pixels help prevent interpolation artifacts near the edges of
 * the final image.
 *
 * DefaultCropOrigin specifies the origin of the final image area, in raw image
 * coordinates (i.e., before the DefaultScale has been applied), relative to
 * the top-left corner of the ActiveArea rectangle.
 *
 * Value 0: DefaultCropOriginH
 * Value 1: DefaultCropOriginV
 */
const DefaultCropOrigin = {
	tag: 50719,
	type: [SHORT, LONG, RATIONAL],
	count: 2,
	default: [0, 0],
};

/**
 * Raw images often store extra pixels around the edges of the final image.
 * These extra pixels help prevent interpolation artifacts near the edges of
 * the final image.

 * DefaultCropSize specifies the size of the final image area, in raw image
 * coordinates (i.e., before the DefaultScale has been applied).
 *
 * Value 0: DefaultCropSizeH
 * Value 1: DefaultCropSizeV
 */
const DefaultCropSize = {
	tag: 50720,
	type: [SHORT, LONG, RATIONAL],
	count: 2,
	default: (ImageWidth, ImageLength) => [ImageWidth, ImageLength],
};

/**
 * ColorMatrix1 defines a transformation matrix that converts XYZ values to
 * reference camera native color space values, under the first calibration
 * illuminant. The matrix values are stored in row scan order.
 *
 * The ColorMatrix1 tag is required for all non-monochrome DNG files.
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const ColorMatrix1 = {
	tag: 50721,
	type: SRATIONAL,
	count: ColorPlanes => ColorPlanes * 3,
};

/**
 * ColorMatrix2 defines a transformation matrix that converts XYZ values to
 * reference camera native color space values, under the second calibration
 * illuminant. The matrix values are stored in row scan order.
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const ColorMatrix2 = {
	tag: 50722,
	type: SRATIONAL,
	count: ColorPlanes => ColorPlanes * 3,
};

/**
 * CameraCalibration1 defines a calibration matrix that transforms reference
 * camera native space values to individual camera native space values under
 * the first calibration illuminant. The matrix is stored in row scan order.
 *
 * This matrix is stored separately from the matrix specified by the
 * ColorMatrix1 tag to allow raw converters to swap in replacement color
 * matrices based on UniqueCameraModel tag, while still taking advantage of any
 * per-individual camera calibration performed by the camera manufacturer.
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const CameraCalibration1 = {
	tag: 50723,
	type: SRATIONAL,
	count: ColorPlanes => ColorPlanes * ColorPlanes,
};

/**
 * CameraCalibration2 defines a calibration matrix that transforms reference
 * camera native space values to individual camera native space values under
 * the second calibration illuminant. The matrix is stored in row scan order.
 *
 * This matrix is stored separately from the matrix specified by the
 * ColorMatrix2 tag to allow raw converters to swap in replacement color
 * matrices based on UniqueCameraModel tag, while still taking advantage of any
 * per-individual camera calibration performed by the camera manufacturer.
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const CameraCalibration2 = {
	tag: 50724,
	type: SRATIONAL,
	count: ColorPlanes => ColorPlanes * ColorPlanes,
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

/**
 * The illuminant used for the first set of color calibration tags. The legal
 * values for this tag are the same as the legal values for the LightSource
 * EXIF tag.
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const CalibrationIlluminant1 = {
	tag: 50778,
	type: SHORT,
	count: 1,
	default: 0,
};

/**
 * The illuminant used for an optional second set of color calibration tags.
 * The legal values for this tag are the same as the legal values for the
 * CalibrationIlluminant1 tag; however, if both are included, neither is
 * allowed to have a value of 0 (unknown).
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const CalibrationIlluminant2 = {
	type: 50779,
	type: SHORT,
	count: 2,
};

/**
 * For some cameras, the best possible image quality is not achieved by
 * preserving the total pixel count during conversion. For example, Fujifilm
 * SuperCCD images have maximum detail when their total pixel count is doubled.
 *
 * This tag specifies the amount by which the values of the DefaultScale tag
 * need to be multiplied to achieve the best quality image size.
 */
const BestQualityScale = {
	tag: 507080,
	type: RATIONAL,
	count: 1,
	default: 1.0,
};

module.exports = {
	DNGVersion,
	DNGBackwardVersion,
	UniqueCameraModel,
	LocalizedCameraModel,
	CFAPlaneColor,
	CFALayout,
	LinearizationTable,
	BlackLevelRepeatDim,
	BlackLevel,
	BlackLevelDeltaH,
	BlackLevelDeltaV,
	WhiteLevel,
	DefaultScale,
	DefaultCropOrigin,
	DefaultCropSize,
	ColorMatrix1,
	ColorMatrix2,
	CameraCalibration1,
	CameraCalibration2,
	AsShotWhiteXY,
	MakerNoteSafety,
	RawImageDigest,
	CalibrationIlluminant1,
	CalibrationIlluminant2,
	BestQualityScale,
};
