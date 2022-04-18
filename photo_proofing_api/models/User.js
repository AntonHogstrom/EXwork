const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      first: {
        type: String,
        length: [2, 50],
        required: true,
        lowercase: true,
        trim: true,
      },
      last: {
        type: String,
        length: [2, 50],
        required: true,
        lowercase: true,
        trim: true,
      },
    },
    company: {
      type: String,
      length: [2, 100],
      default: "",
      trim: true,
    },
    email: {
      type: String,
      length: [2, 100],
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      length: [8, 1024],
      required: true,
    },
    profilePicture: {
      type: String,
      length: [2, 100],
      trim: true,
      default: "anon.png",
    },
    bio: {
      type: String,
      length: [2, 200],
      default: "",
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
    },
    everLoggedIn: {
      type: Boolean,
      default: false,
    },
    loggedIn: {
      type: Boolean,
      default: false,
    },
    loggedInAt: {
      type: Date,
    },
    visited: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      enum: ["photographer", "customer", "admin"],
      default: "customer",
    },
    invites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invite",
      },
    ],
    albums: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Album",
      },
    ],
  },
  { collection: "User" }
);

//Sätter updatedAt vid updatering
UserSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
