const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const allQuestions = new Schema({
  solved: {
    type: Boolean,
    default: false,
  },
  difficulty: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sample: {
    type: String,
    required: true,
  },
  main: {
    type: [String],
    required: true,
  },
  sampleAnswer: {
    type: String,
    required: true,
  },
  mainAnswer: {
    type: [String],
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("allQuestions", allQuestions);
