const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userProfile = new Schema({
  firstName: {
    type: String,
    default: null,
    trim: true,
  },
  lastName: {
    type: String,
    default: null,
    trim: true,
  },
  gender: {
    type: String,
    default: "male",
  },
  dob: {
    type: Date,
    default: null,
  },
  contact: {
    type: Number,
    default: null,
    trim: true,
  },
  linkedIn: {
    type: String,
    default: null,
    trim: true,
  },
  gitHub: {
    type: String,
    default: null,
    trim: true,
  },
  about: {
    type: String,
    default: null,
    trim: true,
  },
});

module.exports = mongoose.model("profile", userProfile);
