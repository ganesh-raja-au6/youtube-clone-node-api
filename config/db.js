const mongoose = require("mongoose");
require('dotenv').config()

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection established."))
  .catch((err) => console.log('error',err.message));