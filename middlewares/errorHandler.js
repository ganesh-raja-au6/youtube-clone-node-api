const ErrorResponse = require(require("path").join(
  __dirname,
  "..",
  "utils",
  "ErrorResponse"
));

exports.errorHandler = (err, req, res, next) => {

  let error = { ...err };

  error.message = err.message;

  // Mongoose CastError
  if (err.name === "CastError") {
    const message = "Resource not found.";
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Duplicate Key
  if(err.name === 11000) {
    const message = "Duplicate field value entered."
    error = new ErrorResponse(message, 400)
  }

  // Mongoose validation error
  if(err.name === "ValidationError") {
    const message = Object.keys(err.errors).map(val => val.message)
    error = new ErrorResponse(message || "Server Error", 400)
  }
  res
    .status(err.statusCode || 500)
    .json({ success: false, error: error.message || "Internal Server Error." });
};
