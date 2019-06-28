const {
	BYTE,
	ASCII,
	SRATIONAL,
	RATIONAL,
	SHORT,
	LONG,
	UNDEFINED,
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

/**
 * ReductionMatrix1 defines a dimensionality reduction matrix for use as the
 * first stage in converting color camera native space values to XYZ values,
 * under the first calibration illuminant. This tag may only be used if
 * ColorPlanes is greater than 3. The matrix is stored in row scan order.
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const ReductionMatrix1 = {
	tag: 50725,
	type: SRATIONAL,
	count: ColorPlanes => ColorPlanes * 3,
};

/**
 * ReductionMatrix2 defines a dimensionality reduction matrix for use as the
 * first stage in converting color camera native space values to XYZ values,
 * under the second calibration illuminant. This tag may only be used if
 * ColorPlanes is greater than 3. The matrix is stored in row scan order.
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const ReductionMatrix2 = {
	tag: 50726,
	type: SRATIONAL,
	count: ColorPlanes => ColorPlanes * 3,
};

/**
 * Normally the stored raw values are not white balanced, since any digital
 * white balancing will reduce the dynamic range of the final image if the
 * user decides to later adjust the white balance; however, if camera hardware
 * is capable of white balancing the color channels before the signal is
 * digitized, it can improve the dynamic range of the final image.
 *
 * AnalogBalance defines the gain, either analog (recommended) or digital (not
 * recommended) that has been applied the stored raw values.
 *
 * See Chapter 6, “Mapping Camera Color Space to CIE XYZ Space” on page 79 for
 * details of the color-processing model.
 */
const AnalogBalance = {
	tag: 50727,
	type: RATIONAL,
	count: ColorPlanes => ColorPlanes,
	default: ColorPlanes => new Array(ColorPlanes).fill(1.0),
};

/**
 * AsShotNeutral specifies the selected white balance at time of capture,
 * encoded as the coordinates of a perfectly neutral color in linear reference
 * space values. The inclusion of this tag precludes the inclusion of the
 * AsShotWhiteXY tag.
 */
const AsShotNeutral = {
	tag: 50728,
	type: [SHORT, RATIONAL],
	count: ColorPlanes => ColorPlanes,
};

/**
 * AsShotWhiteXY specifies the selected white balance at time of capture,
 * encoded as x-y chromaticity coordinates. The inclusion of this tag precludes
 * the inclusion of the AsShotNeutral tag.
 */
const AsShotWhiteXY = {
	tag: 50729,
	type: RATIONAL,
	count: 2,
};

/**
 * Camera models vary in the trade-off they make between highlight headroom and
 * shadow noise. Some leave a significant amount of highlight headroom during a
 * normal exposure. This allows significant negative exposure compensation to
 * be applied during raw conversion, but also means normal exposures will
 * contain more shadow noise. Other models leave less headroom during normal
 * exposures. This allows for less negative exposure compensation, but results
 * in lower shadow noise for normal exposures.
 *
 * Because of these differences, a raw converter needs to vary the zero point
 * of its exposure compensation control from model to model. BaselineExposure
 * specifies by how much (in EV units) to move the zero point. Positive values
 * result in brighter default results, while negative values result in darker
 * default results.
 */
const BaselineExposure = {
	tag: 50730,
	type: SRATIONAL,
	count: 1,
	default: 0.0,
};

/**
 * BaselineNoise specifies the relative noise level of the camera model at a
 * baseline ISO value of 100, compared to a reference camera model.
 *
 * Since noise levels tend to vary approximately with the square root of the
 * ISO value, a raw converter can use this value, combined with the current
 * ISO, to estimate the relative noise level of the current image.
 */
const BaselineNoise = {
	tag: 50731,
	type: RATIONAL,
	count: 1,
	default: 1.0,
};

/**
 * BaselineSharpness specifies the relative amount of sharpening required for
 * this camera model, compared to a reference camera model. Camera models vary
 * in the strengths of their anti- aliasing filters. Cameras with weak or no
 * filters require less sharpening than cameras with strong anti-aliasing
 * filters.
 */
const BaselineSharpness = {
	tag: 50732,
	type: RATIONAL,
	count: 1,
	default: 1.0,
};

/**
 * BayerGreenSplit only applies to CFA images using a Bayer pattern filter
 * array. This tag specifies, in arbitrary units, how closely the values of the
 * green pixels in the blue/green rows track the values of the green pixels in
 * the red/green rows.
 *
 * A value of zero means the two kinds of green pixels track closely, while a
 * non-zero value means they sometimes diverge. The useful range for this tag
 * is from 0 (no divergence) to about 5000 (quite large divergence).
 */
const BayerGreenSplit = {
	tag: 50733,
	type: LONG,
	count: 1,
	default: 0,
};

/**
 * Some sensors have an unpredictable non-linearity in their response as they
 * near the upper limit of their encoding range. This non-linearity results in
 * color shifts in the highlight areas of the resulting image unless the raw
 * converter compensates for this effect.
 *
 * LinearResponseLimit specifies the fraction of the encoding range above which
 * the response may become significantly non-linear.
 */
const LinearResponseLimit = {
	tag: 50734,
	type: RATIONAL,
	count: 1,
	default: 1.0,
};

/**
 * CameraSerialNumber contains the serial number of the camera or camera body
 * that captured the image.
 */
const CameraSerialNumber = {
	tag: 50735,
	type: ASCII,
};

/**
 * LensInfo contains information about the lens that captured the image. If the
 * minimum f-stops are unknown, they should be encoded as 0/0.
 *
 * Value 0: Minimum focal length in mm.
 * Value 1: Maximum focal length in mm.
 * Value 2: Minimum (maximum aperture) f-stop at minimum focal length.
 * Value 3: Minimum (maximum aperture) f-stop at maximum focal length.
 */
const LensInfo = {
	tag: 50736,
	type: RATIONAL,
	count: 4,
};

/**
 * ChromaBlurRadius provides a hint to the DNG reader about how much chroma
 * blur should be applied to the image. If this tag is omitted, the reader will
 * use its default amount of chroma blurring.
 *
 * Normally this tag is only included for non-CFA images, since the amount of
 * chroma blur required for mosaic images is highly dependent on the de-mosaic
 * algorithm, in which case the DNG reader's default value is likely optimized
 * for its particular de-mosaic algorithm.
 */
const ChromaBlurRadius = {
	tag: 50737,
	type: RATIONAL,
	count: 1,
};

/**
 * AntiAliasStrength provides a hint to the DNG reader about how strong the
 * camera's anti-alias filter is. A value of 0.0 means no anti-alias filter
 * (i.e., the camera is prone to aliasing artifacts with some subjects), while
 * a value of 1.0 means a strong anti-alias filter (i.e., the camera almost
 * never has aliasing artifacts).
 *
 * Note that this tag overlaps in functionality with the BaselineSharpness tag.
 * The primary difference is the AntiAliasStrength tag is used as a hint to the
 * de-mosaic algorithm, while the BaselineSharpness tag is used as a hint to a
 * sharpening algorithm applied later in the processing pipeline.
 */
const AntiAliasStrength = {
	tag: 50738,
	type: RATIONAL,
	count: 1,
	default: 1.0,
};

/**
 * This tag is used by Adobe Camera Raw to control the sensitivity of its
 * "Shadows" slider.
 */
const ShadowScale = {
	tag: 50739,
	type: RATIONAL,
	count: 1,
	default: 1.0,
};

/**
 * DNGPrivateData provides a way for camera manufacturers to store private data
 * in the DNG file for use by their own raw converters, and to have that data
 * preserved by programs that edit DNG files.
 *
 * The private data must follow these rules:
 *
 * The private data must start with a null-terminated ASCII string identifying
 * the data. The first part of this string must be the manufacturer's name, to
 * avoid conflicts between manufacturers.
 *
 * The private data must be self-contained. All offsets within the private data
 * must be offsets relative to the start of the private data, and must not
 * point to bytes outside the private data.
 *
 * The private data must be byte-order independent. If a DNG file is converted
 * from a big- endian file to a little-endian file, the data must remain valid.
 */
const DNGPrivateData = {
	tag: 50740,
	type: BYTE,
};

/**
 * MakerNoteSafety lets the DNG reader know whether the EXIF MakerNote tag is
 * safe to preserve along with the rest of the EXIF data. File browsers and
 * other image management software processing an image with a preserved
 * MakerNote should be aware that any thumbnail image embedded in the MakerNote
 * may be stale, and may not reflect the current state of the full size image.
 *
 * A MakerNote is safe to preserve if it follows these rules:
 *
 * The MakerNote data must be self-contained. All offsets within the MakerNote
 * must be offsets relative to the start of the MakerNote, and must not point
 * to bytes outside the MakerNote.
 *
 * The MakerNote data must be byte-order independent. Moving the data to a file
 * with a different byte order must not invalidate it.
 *
 * Value: 0 (unsafe) or 1 (safe)
 */
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

/**
 * This tag contains a 16-byte unique identifier for the raw image data in the
 * DNG file. DNG readers can use this tag to recognize a particular raw image,
 * even if the file's name or the metadata contained in the file has been
 * changed.
 *
 * If a DNG writer creates such an identifier, it should do so using an
 * algorithm that will ensure that it is very unlikely two different images will
 * end up having the same identifier.
 */
const RawDataUniqueID = {
	tag: 50781,
	type: BYTE,
	count: 16,
};

/**
 * If the DNG file was converted from a non-DNG raw file, then this tag contains
 * the file name of that original raw file.
 */
const OriginalRawFileName = {
	tag: 50827,
	type: [ASCII, BYTE],
};

/**
 * If the DNG file was converted from a non-DNG raw file, then this tag contains
 * the compressed contents of that original raw file.
 *
 * The contents of this tag always use the big-endian byte order.
 *
 * The tag contains a sequence of data blocks. Future versions of the DNG
 * specification may define additional data blocks, so DNG readers should ignore
 * extra bytes when parsing this tag. DNG readers should also detect the case
 * where data blocks are missing from the end of the sequence, and should assume
 * a default value for all the missing blocks.
 *
 * There are no padding or alignment bytes between data blocks.
 * The sequence of data blocks is:
 *
 * 1. Compressed data fork of original raw file.
 * 2. CompressedMacOSresourceforkoforiginalrawfile.
 * 3. MacOSfiletype(4bytes)oforiginalrawfile.
 * 4. MacOSfilecreator(4bytes)oforiginalrawfile.
 * 5. Compresseddataforkofsidecar".THM"file.
 * 6. CompressedMacOSresourceforkofsidecar".THM"file.
 * 7. MacOSfiletype(4bytes)ofsidecar".THM"file.
 * 8. Mac OS file creator (4 bytes) of sidecar ".THM" file.
 *
 * If the Mac OS file types or creator codes are unknown, zero is stored.
 *
 * If the Mac OS resource forks do not exist, they should be encoded as zero
 * length forks.
 *
 * Each fork (data or Mac OS resource) is compressed and encoded as:
 * ForkLength = first four bytes. This is the uncompressed length of this fork.
 * If this value is zero, then no more data is stored for this fork.
 *
 * From ForkLength, compute the number of 64K compression blocks used for this
 * data (the last block is usually smaller than 64K):
 * ForkBlocks = Floor ((ForkLength + 65535) / 65536)
 *
 * The next (ForkBlocks + 1) 4-byte values are an index into the compressed
 * data. The first ForkBlock values are offsets from the start of the data for
 * this fork to the start of the compressed data for the corresponding
 * compression block. The last value is an offset from the start of the data for
 * this fork to the end of the data for this fork.
 *
 * Following this index is the ZIP compressed data for each 64K compression
 * block.
 */
const OriginalRawFileData = {
	tag: 50828,
	type: UNDEFINED,
};

/**
 * This rectangle defines the active (non-masked) pixels of the sensor. The
 * order of the rectangle coordinates is: top, left, bottom, right.
 */
const ActiveArea = {
	tag: 50829,
	type: [SHORT, LONG],
	count: 4,
	default: (ImageLength, ImageWidth) => [0, 0, ImageLength, ImageWidth],
};

/**
 * This tag contains a list of non-overlapping rectangle coordinates of fully
 * masked pixels, which can be optionally used by DNG readers to measure the
 * black encoding level.
 *
 * The order of each rectangle's coordinates is: top, left, bottom, right.
 *
 * If the raw image data has already had its black encoding level subtracted,
 * then this tag should not be used, since the masked pixels are no longer
 * useful.
 *
 * Note that DNG writers are still required to include estimate and store the
 * black encoding level using the black level DNG tags. Support for the
 * MaskedAreas tag is not required of DNG readers.
 */
const MaskedAreas = {
	tag: 50830,
	type: [SHORT, LONG],
	count: numberOfRectangles => numberOfRectangles * 4,
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
	ReductionMatrix1,
	ReductionMatrix2,
	AnalogBalance,
	AsShotNeutral,
	AsShotWhiteXY,
	BaselineExposure,
	BaselineNoise,
	BaselineSharpness,
	BayerGreenSplit,
	LinearResponseLimit,
	CameraSerialNumber,
	LensInfo,
	ChromaBlurRadius,
	AntiAliasStrength,
	ShadowScale,
	DNGPrivateData,
	MakerNoteSafety,
	RawImageDigest,
	CalibrationIlluminant1,
	CalibrationIlluminant2,
	BestQualityScale,
	RawDataUniqueID,
	OriginalRawFileName,
	OriginalRawFileData,
	ActiveArea,
	MaskedAreas
};
