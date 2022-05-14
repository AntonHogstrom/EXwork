const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 100,
      required: true,
    },
    watermark: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 103,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    album: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
    customers: {
      type: Array,
      default: [],
      customers: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        like: {
          type: Boolean,
          default: false,
        },
        watermarked: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  { collection: "Photo" }
);

module.exports = mongoose.model("Photo", PhotoSchema);
