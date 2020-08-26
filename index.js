// NPM packages
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const { errorHandler } = require(path.join(
  __dirname,
  "middlewares",
  "errorHandler"
));

// configuring dotenv
require("dotenv").config();

// DB connections
require("./config/db.js");

// Initializing app
const app = express();

// Initializing middlewares
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// configuring morgan
if (process.env.NODE_ENV === "development") {
  app.use(morgan());
}

// Versioning api
const v1 = (route) => `/api/v1/${route}`;

// routes
app.use(v1("user"), require(path.join(__dirname, "routes", "user")));
app.use(v1("auth"), require(path.join(__dirname, "routes", "auth")));
app.use(v1("video"), require(path.join(__dirname, "routes", "video")));
app.use("/", (req, res) => {
  return res.json("Hi");
});

// Error Handler
app.use(errorHandler);

// Listening/ connecting to a server
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on port ${process.env.PORT || 5000}`)
);
