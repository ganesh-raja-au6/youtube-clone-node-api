const [mongoose, crypto] = [require("mongoose"), require("crypto")];

const userSchema = new mongoose.Schema(
  {
    username: {
      type: "String",
      required: [true, `username can't be empty.`],
      minlength: [3, `username can't be less than 3 characters.`],
      maxlength: [25, `username can't be greater than 25 characters.`],
      trim: true,
    },
    email: {
      type: "String",
      required: [true, `email can't be empty.`],
      unique: [true, `email already exists.`],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        `Enter a valid email`,
      ],
      trim: true,
    },
    password: {
      type: "String",
      required: [true, `password can't be empty.`],
      minlength: [8, `password must be at least 8 characters.`],
      maxlength: [64, `password cannot be longer than 16 characters.`],
      trim: true
    }
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("User", userSchema);
