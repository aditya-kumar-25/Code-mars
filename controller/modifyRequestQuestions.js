const requestQuestions = require("../models/requestQuestions");

exports.pushRequestQuestion = async (req, res) => {
  const {
    title,
    descripion,
    sample,
    author,
    difficulty,
    main,
    sampleAnswer,
    mainAnswer,
  } = req.body;

  if (
    !title ||
    !descripion ||
    !sample ||
    !main ||
    !sampleAnswer ||
    !mainAnswer ||
    !difficulty ||
    !author
  ) {
    return res.status(403).json({
      success: false,
      message: "Enter all details",
    });
  }
  try {
    await requestQuestions.create({
      title,
      descripion,
      sample,
      main,
      sampleAnswer,
      mainAnswer,
      difficulty,
      author,
    });

    return res.status(200).json({
        success: true,
        message: 'Pushed successfully!',
    })

  } catch (err) {
    console.log("Error while pushing the question: ", err);
    return res.status(403).json({
      success: false,
      message: "Error while pushing the question",
    });
  }
};

exports.fetchRequestQuestions = async (req , res) => {
    try{
        const arr = await requestQuestions.find({})

        return res.status(200).json({
            success: true,
            data: arr,
            message: 'Questions fetched successfully',
        })
    } catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error while fetching!'
        })
    }
}