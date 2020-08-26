const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "Add a title here...",
      min: [5, `Title can't be less than 5 characters.`],
      trim: true,
    },
    description: {
      type: String,
      default: "Add a description here...",
      min: [20, `Description can't be less than 20 characters.`],
      trim: true,
    },
    thumbnailUrl: {
      type: Object,
      default: "no-photo.jpg",
    },
    videoUrl: {
      type: Object,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    views: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required : [true, `Invalid User`]
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

module.exports = mongoose.model("Video", VideoSchema);