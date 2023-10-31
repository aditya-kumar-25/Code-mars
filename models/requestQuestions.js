const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestQuestions = new Schema({
  difficulty: {
    type : String,
    required: true
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
  main:{
    type: [String],
    required: true,
  },
  sampleAnswer: {
    type: String,
    required: true,
  },
  mainAnswer: {
    type: [{
      type:Schema.Types.ObjectId
    }],
    required: true,
  },
  tags:{
    type: [String],
    required: true,
  }
});

module.exports = mongoose.model("requestQuestions", requestQuestions);
