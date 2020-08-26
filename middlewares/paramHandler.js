const path = require("path");
// Error Handler
const ErrorResponse = require(path.join(
  __dirname,
  "..",
  "utils",
  "errorResponse"
));

// asyncHandler
const { asyncHandler } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "asyncHandler"
));

// Models
const [User, Video] = [
  require(path.join(__dirname, "..", "models", "User")),
  require(path.join(__dirname, "..", "models", "video")),
];

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (!user) return next(new ErrorResponse(`Invalid user.`, 401));
  req.profile = user;
  next();
});

exports.getVideoById = asyncHandler(async (req, res, next) => {
  const video = await Video.findById(req.params.videoId);
  if (!video) return next(new ErrorResponse(`Invalid video.`, 401));
  req.videoProfile = video;
  next();
});