const [router, path] = [require("express").Router(), require("path")];

// Controllers
const {
  uploadVideo,
  updateVideoDetails,
  updateThumbnail,
  removeVideo,
  getAllVideos,
  getAllVideosById,
  videoViews
} = require(path.join(__dirname, "..", "controllers", "videos"));

// Middlewares
const { videoDetailsValidation } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "authValidation"
));
const { isAuthorized } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "isAuthorized"
));
const { multerUploadvideo, multerUploadSinglePhoto } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "multer"
));
const { getUserById, getVideoById } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "paramHandler"
));
const { validUser } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "validUser"
));

// @desc      POST UPLOAD VIDEO
// @route     /api/v1/video/upload
// @access    private
router.post(
  "/upload/:userId",
  isAuthorized,
  validUser,
  multerUploadvideo,
  uploadVideo
);

// @desc      POST UPDATE VIDEO DETAILS
// @route     /api/v1/video/update
// @access    private
router.put(
  "/update/:userId/:videoId",
  isAuthorized,
  validUser,
  videoDetailsValidation,
  updateVideoDetails
);

// @desc     POST UPDATE THUMBNAIL
// @route    /api/v1/video/update/thumbnail
// @access   Private
router.put(
  "/update/thumbnail/:userId/:videoId",
  isAuthorized,
  validUser,
  multerUploadSinglePhoto,
  updateThumbnail
);

// @desc    POST  DELETE VIDEO
// @route   /api/v1/video/remove
// @access   private
router.delete("/remove/:userId/:videoId", isAuthorized, validUser, removeVideo);

// @desc     POST GET ALL VIDEOS
// @route    /api/v1/video/fetchall
// @access   public
router.get("/", getAllVideos);

// @desc     POST GET ALL VIDEOS
// @route    /api/v1/video/fetchall
// @access   public
router.get("/:userId", isAuthorized, validUser, getAllVideosById);

// @desc     POST GET ALL VIDEOS
// @route    /api/v1/video/fetchall
// @access   public
router.put("/views/:videoId", videoViews);

// router Params Handler
router.param("userId", getUserById);

router.param("videoId", getVideoById);

module.exports = router;