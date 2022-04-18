const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    tags: {
      type: Array,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    watermark: {
      type: String,
      trim: true,
    },
    watermarked: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { collection: "Photo" }
);

PhotoSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Photo", PhotoSchema);
