const requestQuestions = require("../models/requestQuestions");
const allQuestions = require("../models/allQuestions");

exports.pushQuestionDirect = async (req, res) => {
  const { author, title, description, sample, main, sampleAnswer, mainAnswer , difficulty , tags} =
    req.body;

    if(!author || !title || !description || !sample || !main || !sampleAnswer || !mainAnswer || !difficulty || !tags){
      return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        }
      )
    }

    
  try {
    await allQuestions.create({
      difficulty,
      author,
      title,
      description,
      sample,
      main,
      sampleAnswer,
      mainAnswer,
      tags,
    });
    return res.status(200).json({
      success: true,
      message: "Question pushed successfully!",
    })

  } catch (err) {
    console.log("Error in pushing question: ", err);
    return res.status(404).json({
      success: false,
      message: "Error in pushing question!",
    });
  }
};

exports.pushQuestion = async (req, res) => {
  const { _id } = req.body;

  try {
    const {
      title,
      description,
      author,
      sample,
      main,
      sampleAnswer,
      mainAnswer,
      difficulty
    } = await requestQuestions.findById(_id);

    try {
      await requestQuestions.findByIdAndDelete(_id);
    } catch (err) {
      console.log("Error while deleting requested question: ", err);
      return res.status(404).json({
        success: false,
        message: "Error while deleting requested question",
      });
    }

    try {
      await allQuestions.create({
        title,
        description,
        author,
        sample,
        main,
        sampleAnswer,
        mainAnswer,
        difficulty,
      });
    } catch (err) {
      console.log("Error while pushing new question: ", err);
      return res.status(404).json({
        success: false,
        message: "Error while pushing new question",
      });
    }
  } catch (err) {
    console.log("Error while pushing the requested question: ", err);
    return res.status(404).json({
      success: false,
      message: "Error while pushing the requested question",
    });
  }
};

exports.popQuestion = async (req, res) => {
  const { _id } = req.body;

  try {
    await requestQuestions.findByIdAndDelete(_id);
  } catch (err) {
    console.log("Problem occured while rejecting the question: ", err);
    return res.status(404).json({
      success: false,
      message: "Problem occured while rejecting the question",
    });
  }
};

exports.fetchQuestion = async (req , res) => {

}
