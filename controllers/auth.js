// NPM modules
const [path, _] = [require("path"), require("lodash")];
const { sign, verify } = require("jsonwebtoken");
const { hash, compare } = require("bcryptjs");

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
exports.signup = asyncHandler((req, res) => {
  const { email, password, username } = req.body;
  sign(
    { email, password, username },
    process.env.JWTSECRET,
    { expiresIn: "10m" },
    (err, token) => {
      if (err) return res.status(500).json({ success: false, error: err });
      authMailer(email, token);
      return res.json({
        success: true,
        message:
          "A verification email has been sent to your email. Please verify.",
      });
    }
  );
});

// @desc     POST VERIFY_TOKEN
// @route    GET /api/v1/auth/verifyToken?token=token
// @access   Private
exports.verifyToken = asyncHandler(async (req, res) => {
  if (!req.query.token)
    return res.status(401).json({ success: false, error: "Invalid Token" });
  verify(req.query.token, process.env.JWTSECRET, (err, payload) => {
    if (err) return res.status(500).json({ success: false, error: err });
    const { email, password, username } = payload;
    hash(password, 10).then((hashed) => {
      const user = new User({ email, username, password: hashed });
      user
        .save()
        .then((user) => {
          user.password = undefined;
          sign(
            { _id: user._id },
            process.env.JWTSECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err)
                return res.status(500).json({ success: false, error: err });
              res.cookie("vtubeauth", token, { expire: 3600 });
              return res.json({
                success: true,
                message: "Token verified successfully.",
                user,
                token,
              });
            }
          );
        })
        .catch((err) => res.status(500).json({ success: false, error: err }));
    });
  });
});

// @desc      POST SIGN_IN
// @route     POST /api/v1/auth/signin
// @access    Public
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    console.log("email");
    return res.json({ success: false, error: "Invaid email || password." });
  }
  const verified = await compare(password, user.password);
  if (!verified)
    return res.json({ success: false, error: "Invalid email || password." });
  sign(
    { _id: user._id },
    process.env.JWTSECRET,
    {
      expiresIn: 3600,
    },
    (err, token) => {
      if (err) return res.status(500).json({ success: false, error: err });
      res.cookie("chitchatauth", token, { expire: 3600 });
      user.password = undefined;
      return res.json({
        success: true,
        token,
        user,
        message: "SignIn successfull.",
      });
    }
  );
};

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
exports.forgotPassword = async (req, res) => {
  if (!req.body.email)
    return res
      .status(403)
      .json({ success: false, error: "Please enter a valid email." });
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(403).json({
      success: false,
      error: `It seems the requested email is not registered with us.`,
    });
    console.log(user._id)
  sign(
    { _id: user._id },
    process.env.JWTSECRET,
    { expiresIn: "10m" },
    (err, token) => {
      if (err) return res.status(500).json({ success: false, error: err });
      resetPasswordMailer(user.email, token);
      return res.json({
        success: true,
        message:
          "A verification email has been sent to your email. Please verify to reset your password.",
      });
    }
  );
};

// @desc    POST RESET_PASSWORD
// @route   /api/v1/auth/resetPassword
// @access  private
exports.resetPassword = async (req, res) => {
  verify(req.query.token, process.env.JWTSECRET, (err, payload) => {
    if (err) return res.status(500).json({ success: false, error: err });
    User.findById(payload._id).then((user) => {
      hash(req.body.password, 10).then(hashed => {
        user.password = hashed
        user.save((err) => {
          if (err) return res.status(500).json({ success: false, error: err });
          return res.json({
            success: true,
            message: "Password reset successful.",
          });
        });
      })
    });
  });
};

// @desc     POST CHANGE_PASSWORD
// @route   /api/v1/auth/changePassword
// @access  private
exports.changePassword = async (req, res) => {
  if (!req.user) {
    return res.status(500).json({ success: false, error: "Invalid request." });
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(500).json({ success: false, error: "Invalid request." });
  }
  const verified = await compare(req.body.oldPassword, user.password);
  if (!verified) {
    return res
      .status(403)
      .json({ success: false, error: "Old password does not match." });
  }
  const hashed = await hash(req.body.password, 10);
  user.password = hashed;
  user.save((err) => {
    if (err) return res.status(500).json({ success: false, error: err });
    return res.json({
      success: true,
      message: "Password changed successfully.",
    });
  });
};
