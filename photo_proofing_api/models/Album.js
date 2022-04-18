const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    tags: {
      type: Array,
      required: true,
      trim: true,
      default: [],
    },
    cover: {
      type: String,
      trim: true,
      default: "albumCover.jpg",
      minlength: 2,
      maxlength: 200,
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
    invites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    photos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Photo",
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { collection: "Album" }
);

AlbumSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Album", AlbumSchema);
