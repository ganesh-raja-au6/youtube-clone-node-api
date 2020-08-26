const { identity } = require("lodash");

// npm packages
const [path, multer, { v4: uuidv4 }, cloudinary, _] = [
  require("path"),
  require("multer"),
  require("uuid"),
  require("cloudinary").v2,
  require("lodash"),
];

// Models
const [User, Video] = [
  require(path.join(__dirname, "..", "models", "User")),
  require(path.join(__dirname, "..", "models", "video")),
];

// Initializing cloudinary storage
require("../config/cloudinary.js");

// Middlewares
const { multerUploadvideo, multerUploadSinglePhoto } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "multer"
));

// asyncHandler
const { asyncHandler } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "asyncHandler"
));

// Error Handler
const ErrorResponse = require(path.join(
  __dirname,
  "..",
  "utils",
  "errorResponse"
));

exports.uploadVideo = asyncHandler(async (req, res, next) => {
  multerUploadvideo(req, res, (err) => {
    if (err) {
      return next(new ErrorResponse("unsupported video format.", 403));
    } else {
      if (req.file === undefined || !req.file) {
        return next(new ErrorResponse("Select a video", 403));
      }
    }
  });
  const videoData = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video",
    // public_id : "./videos/sub_videos/comedy",
    chunk_size: 6000000,
  });
  const video = new Video({
    videoUrl: { video: videoData.secure_url, public_id: videoData.public_id },
    user: req.user,
  });
  await video.save();
  return res.json({
    success: true,
    file: `uploads/${req.file.filename}`,
    message: "video upload successful.",
    data: video,
  });
});

exports.updateVideoDetails = asyncHandler(async (req, res, next) => {
  const video = req.videoProfile;
  _.extend(video, req.body);
  await video.save();
  return res.json({
    success: true,
    data: video,
    message: "Details updated successfully.",
  });
});

exports.updateThumbnail = asyncHandler(async (req, res, next) => {
  multerUploadSinglePhoto(req, res, (err) => {
    if (err) return next(new ErrorResponse("Unsupported Image file.", 403));
    if (req.file === undefined || !req.file)
      return next(new ErrorResponse("Select an Image file.", 403));
  });
  const video = req.videoProfile;
  const image = await cloudinary.uploader.upload(req.file.path);
  video.thumbnailUrl = { url: image.secure_url, public_id: image.public_id };
  await video.save();
  return res.json({
    success: true,
    data: video,
    message:
      "Thumbnail updated successfully. Your audience will see it a moment.",
  });
});

exports.removeVideo = asyncHandler(async (req, res, next) => {
  const video = req.videoProfile;
  await Video.findByIdAndDelete(video._id);
  await cloudinary.uploader.destroy(video.thumbnailUrl.public_id);
  return res.json({ success: true, message: "video deleted successfully." });
});

exports.getAllVideos = asyncHandler(async (req, res, next) => {
  const data = await Video.find().populate("user", "_id email username");
  if (!data)
    return next(new Error("This Channel doesn't contain any videos"), 404);
  return res.json({ success: true, data, count: data.length });
});

exports.getAllVideosById = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const data = await Video.find({ user: user._id });
  if (!data)
    return next(new Error("This Channel doesn't contain any videos"), 404);
  return res.json({ success: true, data, count: data.length });
});

exports.videoViews = asyncHandler(async (req, res, next) => {
  const video = req.videoProfile;
  const data = await Video.findById(video._id);
  data.views++;
  await data.save();
  return res.json({ success: true, message: "view update.", data });
});
