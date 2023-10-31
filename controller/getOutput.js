const axios = require("axios");
require("dotenv").config();
const userSchema = require("../models/userSchema");
const questions = require("../models/questions");

const user = require("../models/userSchema");
const allQuestions = require("../models/allQuestions");
const discussionSchema = require("../models/discussionSchema");
const allSubmissionSchema = require("../models/allSubmissionSchema");

exports.getOutput = async (req, res) => {
  const { code, input, language } = req.body;

  const options = {
    method: "POST",
    url: "https://code-compiler10.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "x-compile": "rapidapi",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": "code-compiler10.p.rapidapi.com",
    },
    data: {
      langEnum: [
        "php",
        "python",
        "c",
        "c_cpp",
        "csharp",
        "kotlin",
        "golang",
        "r",
        "java",
        "typescript",
        "nodejs",
        "ruby",
        "perl",
        "swift",
        "fortran",
        "bash",
      ],
      lang: `${language}`,
      code: `${code}`,
      input: `${input}`,
    },
  };

  try {
    const response = await axios.request(options);
    return res.status(200).json({
      success: true,
      message: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Code running failed",
    });
  }
};

exports.fetchAllQuestions = async (req, res) => {
  try {
    const { userHandle } = req.body;

    let solvedQuestions = [];

    if (userHandle) {
      let user = await userSchema.findOne({ userHandle });

      let userQuestions = await questions.findById(user.questionSolved)

      solvedQuestions = userQuestions.total;
    }

    const allQ = await allQuestions.find({});

    for (let i = 0; i < allQ.length; i++) {
      if (solvedQuestions.includes(allQ[i]._id)) {
        allQ[i].solved = true;
      }
      else allQ[i].solved = false;

    }

    return res.status(200).json({
      success: true,
      data: allQ,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching all questions",
    });
  }
};

exports.findOneQuestion = async (req, res) => {
  const id = req.params.id;

  try {
    const requiredQuestion = await allQuestions.findById(id);
    return res.status(200).json({
      success: true,
      question: requiredQuestion,
      message: "Question fetched successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in fetching question",
      err: err,
    });
  }
};

async function utilityGetOutput(language, code, input) {
  const options = {
    method: "POST",
    url: "https://code-compiler10.p.rapidapi.com/",
    headers: {
      "content-type": "application/json",
      "x-compile": "rapidapi",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": process.env.COMPILER_API_KEY,
      "X-RapidAPI-Host": "code-compiler10.p.rapidapi.com",
    },
    data: {
      langEnum: [
        "php",
        "python",
        "c",
        "c_cpp",
        "csharp",
        "kotlin",
        "golang",
        "r",
        "java",
        "typescript",
        "nodejs",
        "ruby",
        "perl",
        "swift",
        "fortran",
        "bash",
      ],
      lang: `${language}`,
      code: `${code}`,
      input: `${input}`,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.output;
  } catch (error) {
    return "Error";
  }
}

function judge(a, b) {
  function extractWords(str) {
    const words = str.split(/\s+/);
    return words.filter(word => word.length > 0);
  }
  
  const wordA = extractWords(a), wordB = extractWords(b);

  if (wordA.length !== wordB.length) {
    return false;
  }

  for (let i = 0; i < wordA.length; i++) {
    if (wordA[i] !== wordB[i]) {
      return false;
    }
  }
  return true;
}

exports.getVerdict = async (req, res) => {
  try {
    const { code, language, qid } = req.body;
    const userHandle = req.user.userHandle;
    const problem = await allQuestions.findById(qid);

    for(let i = 0 ; i < problem.main.length ; i++){

      const output = await utilityGetOutput(language , code , problem.main[i]);

      if(!judge(output , problem.mainAnswer[i])){

        await allSubmissionSchema.create({
          qid:problem._id,
          userHandle: userHandle,
          date: new Date(),
          verdict: `Wrong answer, passed: ${i}/${problem.main.length}`,
          title: problem.title,
        })

        return res.status(200).json({
          success: true,
          message: 'Wrong answer',
        })
      }

    }

    await allSubmissionSchema.create({
      qid:qid,
      userHandle: userHandle,
      date: new Date(),
      verdict: `Correct answer, passed: ${problem.main.length}/${problem.main.length}`,
      title:problem.title,
    })

    const person = await userSchema.findOne({userHandle: userHandle});

    const questionInfo = await questions.findById(person.questionSolved);

    if(!questionInfo.total.includes(problem._id)){
      questionInfo.total.push(problem._id)
      if(problem.difficulty == 'easy'){
        questionInfo.easy++;
        questionInfo.score += 5;
      }
      else if(problem.difficulty == 'medium'){
        questionInfo.medium++;
        questionInfo.score += 10;
      }
      else{
        questionInfo.hard++;
        questionInfo.score += 20;
      } 
    }

    questionInfo.save();

    return res.status(200).json({
      success: true,
      message: 'Correct answer',
    })

  } catch (err) {
    console.log(err);
    return res.status(403).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getDiscussion = async (req, res) => {
  const qid = req.params.id;

  try {
    const discussion = await discussionSchema.find({
      qid: qid,
    });

    discussion.reverse();

    return res.status(200).json({
      success: true,
      data: discussion,
    });
  } catch (err) {
    return res.status(404).json({
      success: false,
      message: "Error while fetching discussions !",
    });
  }
};

exports.mySubmissions = async (req, res) => {

  const {id} = req.body;

  const userHandle = req.user.userHandle;

  try {
    const userSubmissions = await allSubmissionSchema.find({
      qid: id,
      userHandle: userHandle,
    });

    userSubmissions.reverse();

    return res.status(200).json({
      success: true,
      data: userSubmissions,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching user-submissions",
    });
  }
};

exports.postDiscussion = async (req, res) => {
  const { id, body, title } = req.body;

  const userHandle = req.user.userHandle;

  try {
    await discussionSchema.create({
      userHandle: userHandle,
      qid: id,
      body: body,
      title: title,
      date: new Date(),
    });

    return res.status(200).json({
      success: true,
      message: "Posted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while posting !",
    });
  }
};

exports.getUser = async (req, res) => {

  console.log('here');
  const userHandle = req.params.userHandle;

  const person = await user.findOne({ userHandle });

  if (!person) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  try {
    const questionInfo = await questions.findById(person.questionSolved);

    const totalEasy = await allQuestions.countDocuments({ difficulty: "easy" });
    const totalHard = await allQuestions.countDocuments({ difficulty: "hard" });
    const totalMedium = await allQuestions.countDocuments({
      difficulty: "medium",
    });

    const total = totalHard + totalMedium + totalEasy;


    const globalRank = await questions.countDocuments({
      score: { $gt: questionInfo.score },
    });

    console.log(globalRank);

    const totalUsers = await questions.countDocuments({});


    return res.status(200).json({
      success: true,
      data: {
        userHandle: `${userHandle}`,
        easy: `${questionInfo.easy}`,
        totalEasy,
        totalMedium,
        totalHard,
        medium: `${questionInfo.medium}`,
        hard: `${questionInfo.hard}`,
        total: `${questionInfo.total.length}/${total}`,
        rank: `${globalRank + 1}/${totalUsers}`,
      },
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.deleteDiscussion = async (req, res) => {
    const {id} = req.body;
    const userHandle = req.user.userHandle;

    try{
      await discussionSchema.findOneAndDelete({
        _id: id,
        userHandle: userHandle,
      })
      return res.status(200).json({
        success: true,
        message: 'Discussion deleted successfully',
      })
    }catch(err){
      return res.status(500).json({
        success: false,
        message: 'Error while deleting discussion',
      })
    }
}

exports.getAllSubmissions = async (req , res) => {
  const userHandle = req.params.userHandle;

  try{

      const submissions = await allSubmissionSchema.find({
        userHandle,
      })

      submissions.reverse();

      return res.status(200).json({
        success: true,
        message: 'Submissions fetched',
        submissions,
      })
  } catch(err){
    return res.status(500).json({
      success: false,
      message: 'Error while fetching submissions',
    })
  }
}