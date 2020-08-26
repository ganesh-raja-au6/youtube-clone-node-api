// NPM modules
const [path, _] = [require("path"), require("lodash")];
const { sign, verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");
const ErrorResponse = require(path.join(
  __dirname,
  "..",
  "utils",
  "errorResponse"
));

// Authentication mailer
const { authMailer, resetPasswordMailer } = require(path.join(
  __dirname,
  "..",
  "utils",
  "mailer"
));
// asyncHandler
const { asyncHandler } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "asyncHandler"
));

// Models
const User = require(path.join(__dirname, "..", "models", "User"));

// @desc      POST SIGNUP
// @route     POST /api/v1/auth/signup
// @access    Public
exports.signup = asyncHandler(async (req, res, next) => {
  const { email, password, username } = req.body;
  const token = await sign(
    { email, password, username },
    process.env.JWTSECRET,
    { expiresIn: "10m" }
  );
  authMailer(email, token);
  return res.json({
    success: true,
    message: "A verification email has been sent to your email. Please verify.",
  });
});

// @desc     POST VERIFY_TOKEN
// @route    GET /api/v1/auth/verifyToken?token=token
// @access   Private
exports.verifyToken = asyncHandler(async (req, res, next) => {
  if (!req.query.token) return next(new ErrorResponse("Invalid Token", 401));
  const payload = await verify(req.query.token, process.env.JWTSECRET);
  const { email, password, username } = payload;
  const hashed = await hash(password, 10);
  const user = new User({ email, password: hashed, username });
  await user.save();
  const token = await sign({ _id: user._id }, process.env.JWTSECRET, {
    expiresIn: "24hr",
  });
  res.cookie("vtubeauth", token, { expire: "24hr" });
  user.password = undefined;
  return res.json({
    success: true,
    message: "Token verified successfully.",
    user,
    token,
  });
});

// @desc      POST SIGN_IN
// @route     POST /api/v1/auth/signin
// @access    Public
exports.signin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorResponse("Invalid email or password", 403));
  const verified = await compare(password, user.password);
  if (!verified)
    return next(new ErrorResponse("Invalid email or password", 403));
  const token = await sign({ _id: user._id }, process.env.JWTSECRET, {
    expiresIn: "24hr",
  });
  res.cookie("vtubeauth", token, { expire: "24hr" });
  user.password = undefined;
  return res.json({ success: true, token, user, message: "signin success." });
});

// @desc    DELETE SIGNOUT
// @route   DELETE /api/v1/auth/signout/
// @access  private
exports.signout = async (req, res) => {
  res.clearCookie("vtubeauth");
  return res.json({
    success: true,
    token: undefined,
    message: "signout success.",
  });
};

// @desc    POST FORGOT_PASSWORD
// @route   POST /api/v1/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  if (!req.body.email)
    return next(new ErrorResponse("Please enter a valid email.", 403));
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new ErrorResponse(
        "It seems the requested email is not registered with us.",
        403
      )
    );
  const token = await sign({ _id: user._id }, process.env.JWTSECRET, {
    expiresIn: "10m",
  });
  resetPasswordMailer(user.email, token);
  return res.json({
    success: true,
    message:
      "A verification email has been sent to your email. Please verify to reset your password.",
  });
});

// @desc    POST RESET_PASSWORD
// @route   /api/v1/auth/resetPassword
// @access  private
exports.resetPassword = asyncHandler(async (req, res) => {
  const payload = await verify(req.query.token, process.env.JWTSECRET);
  const user = await User.findById(payload._id);
  const hashed = await hash(req.body.password, 10);
  user.password = hashed;
  await user.save();
  return res.json({ success: true, message: "Password reset successful." });
});

// @desc     POST CHANGE_PASSWORD
// @route   /api/v1/auth/changePassword
// @access  private
exports.changePassword = asyncHandler(async (req, res) => {
  if (!req.user) {
    return next(new ErrorResponse("Invalid request", 500))
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorResponse("Invalid request", 500));
  }
  const verified = await compare(req.body.oldPassword, user.password);
  if (!verified) {
    return next(new ErrorResponse("Old password does not match", 403))
  }
  const hashed = await hash(req.body.password, 10);
  user.password = hashed;
  user.save((err) => {
    if (err) next(new ErrorResponse(err, 500))
    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  });
});
