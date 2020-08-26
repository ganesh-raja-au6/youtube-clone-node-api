const path = require("path");
// Error Handler
const ErrorResponse = require(path.join(
  __dirname,
  "..",
  "utils",
  "errorResponse"
));

exports.validUser = async (req, res, next) => {
  const user = (req.profile._id).toString() === (req.user._id).toString()
  if (!user){
    return next(new ErrorResponse("Invalid user.", 403))
  }
  next();
};