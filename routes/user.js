const [router, path] = [require("express").Router(), require("path")];

// controllers
const {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
} = require(path.join(__dirname, "..", "controllers", "users"));

// Middlewares
const {
  signupValidation,
  changePasswordValidation,
  resetPasswordValidation,
} = require(path.join(__dirname, "..", "middlewares", "authValidation"));
const { isAuthorized } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "isAuthorized"
));
const { getUserById, getVideoById } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "paramHandler"
));

// @desc      GET GET USERS
// @route     /api/v1/user/
// @access    private
router.get("/getAllUsers", isAuthorized, getAllUsers);

// @desc      PUT UPDATE USER
// @route     /api/v1/user/update/:userId
// @access    private
router.put("/update/:userId", isAuthorized, updateUser);

// @desc    POST  DELETE USER
// @route   /api/v1/user/remove
// @access   private
router.delete("/remove/:userId", isAuthorized, deleteUser);

// @desc     GET USERBYID
// @route    /api/v1/user/:userId
// @access   public
router.get("/", getSingleUser);

// router Params Handler
router.param("userId", getUserById);

router.param("videoId", getVideoById);

module.exports = router;
