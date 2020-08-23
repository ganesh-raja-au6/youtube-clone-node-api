// NPM modules
const path = require("path");
const User = require(path.join(__dirname, "..", "models", "User"));

exports.emailCheck = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(403)
      .json({ success: false, error: "Email already in use." });
  }
  next();
};
