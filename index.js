// NPM packages
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

// DB connections
require("./config/db.js");

// Initializing app
const app = express();

// configuring dotenv
require("dotenv").config();

// Initializing middlewares
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// Versioning api
const v1 = (route) => `/api/v1/${route}`

// routes
app.use(v1('auth'), require(path.join(__dirname, "routes", "auth")))
app.use("/", (req, res) => {
  return res.json('Hi')
})



// Listening/ connecting to a server
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server listening on port ${process.env.PORT || 5000}`)
);