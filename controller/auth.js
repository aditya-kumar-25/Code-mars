const user = require("../models/userSchema");
const questions = require("../models/questions");
const OTP = require("../models/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const path = require("path");
const fs = require("fs");
const ejsTemplatePath = path.join(__dirname, "otpBody.ejs");
const ejs = require("ejs");
const allQuestions = require("../models/allQuestions");
const profile = require("../models/profile");

exports.signup = async (req, res) => {
  try {
    const { password, email, userHandle, otp } = req.body;

    console.log(req.body);

    if (!password || !email || !userHandle || !otp) {
      return res.status(400).json({
        status: false,
        message: "Fill all the information carefully",
      });
    }

    const findOTP = await OTP.findOne({ email });

    if (!findOTP) {
      return res.status(404).json({
        success: false,
        message: "Session time expired",
      });
    } else if (findOTP.otp !== otp) {
      return res.status(404).json({
        success: false,
        message: "Incorrect otp",
      });
    }

    const checkEmail = await user.findOne({ email: email });

    if (checkEmail) {
      return res.status(403).json({
        status: false,
        message: "You already've an account",
      });
    }

    const checkUser = await user.findOne({ userHandle });

    if (checkUser) {
      return res.status(403).json({
        status: false,
        message: "User-handle already exist,choose a new one",
      });
    }

    let hashPassword = await bcrypt.hash(password, 10);

    let userQuestion = await questions.create({});

    let userProfile = await profile.create({});

    const newUser = await user.create({
      userHandle,
      password: hashPassword,
      email,
      questionSolved: userQuestion._id,
      profile: userProfile._id,
    });

    return res.status(200).json({
      success: true,
      newUser: newUser,
    });
  } catch (err) {
    console.log("Error while signing-up user: ", err);
    return res.status(402).json({
      status: false,
      message: "error in creating new user",
    });
  }
};

exports.login = async (req, res) => {
  console.log(req);

  try {
    const { email, password } = req.body;

    if (!email) {
      return res
        .status(403)
        .json({ success: false, message: "Enter your email" });
    }
    if (!password) {
      return res
        .status(403)
        .json({ success: false, message: "Enter your password" });
    }

    let findUser = await user.findOne({ email });

    if (!findUser) {
      return res
        .status(403)
        .json({ success: false, message: "User does not exist" });
    }

    if (await bcrypt.compare(password, findUser.password)) {
      // passwaord match

      const payload = {
        email: findUser.email,
        userHandle: findUser.userHandle,
        id: findUser._id,
        ok: true,
      };

      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "168h",
      });

      findUser = findUser.toObject();
      findUser.token = token;
      findUser.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      // cookie inside header *****************
      res.header("Authorization", `Bearer ${token}`);

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token: token,
        user: findUser,
        message: "Logged in successfully",
      });
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Password did not match" });
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Something went wrong while logging-in",
      err: err,
    });
  }
};

exports.sendOTPSignUp = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUser = await user.findOne({ email: email });
    if (checkUser) {
      console.log("user already exists");
      return res.status(403).json({
        status: false,
        message: "user already exists",
      });
    }

    let result = await OTP.findOne({ email });

    var otp = null;

    if (result) {
      otp = result.otp;
      console.log("here", otp);
    } else {
      otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      await OTP.create({ email, otp });
    }

    console.log(otp);

    const otpInfo = {
      title: "Email verification to Sign up for DSA Tracker",
      purpose:
        "Thank you for registering with DSA Tracker. To complete your registration, please use the following OTP (One-Time Password) to verify your account:",
      OTP: `${otp}`,
    };

    const otpBody = fs.readFileSync(ejsTemplatePath, "utf-8");

    const renderedHTML = ejs.render(otpBody, otpInfo);

    mailSender(email, "Sign Up verification", renderedHTML);

    return res.status(200).json({
      success: true,
      message: "otp send successfully",
    });
  } catch (err) {
    console.log("Error in sending otp: ", err);
    return res.status(402).json({
      success: false,
      message: "error in sending OTP",
    });
  }
};

exports.sendOtpResetPassword = async (req, res) => {
  console.log("reached backend");
  try {
    const { email } = req.body;

    const checkUser = await user.findOne({ email: email });

    if (!checkUser) {
      return res.status(403).json({
        success: false,
        message: "Account does not exist",
      });
    }

    let result = await OTP.findOne({ email });

    var otp = null;

    if (result) {
      otp = result.otp;
    } else {
      otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      await OTP.create({ email, otp });
    }

    const otpInfo = {
      title: "Email verification to reset your password",
      purpose:
        "To reset your password, please use the following OTP (One-Time Password) to verify your account:",
      OTP: `${otp}`,
    };

    const otpBody = fs.readFileSync(ejsTemplatePath, "utf-8");

    const renderedHTML = ejs.render(otpBody, otpInfo);

    mailSender(email, "Reset password request", renderedHTML);

    return res.status(200).json({
      success: true,
      message: "otp sent successfully",
    });
  } catch (err) {
    console.log("Error in sending otp: ", err);
    return res.status(402).json({
      success: false,
      message: "error in sending OTP",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { password, otp, email } = req.body;

    let currUser = await OTP.findOneAndDelete({ email: email });
    if (!currUser) {
      return res.status(403).json({
        success: false,
        message: "Session time expired",
      });
    }

    if (currUser.otp !== otp) {
      return res.status(403).json({
        success: false,
        message: "Incorrect otp",
      });
    }

    let hashPassword = null;

    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(403).json({
        success: false,
        message: "Something went wrong while hashing password",
        err: err,
      });
    }

    let userToUpdate = await user.findOne({ email });

    userToUpdate.password = hashPassword;

    await userToUpdate.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Something went wrong while resetting password",
      err: err,
    });
  }
};

exports.getInfo = async (req , res) => {
    const userHandle = req.params.userHandle
    try{
      const person = await user.findOne({userHandle});

      const profileInfo = await profile.findById(person.profile);

      return res.status(200).json({
        success: true,
        message: 'Profile information fetched successfully',
        profile:profileInfo,
      })

    }catch(err){
      return res.status(403).json({
        success:false,
        message:"Something went wrong while fetching user info",
        err:err,
      })
    }
}

exports.getProfileInfo = async (req , res) => {

  const {userHandle} = req.user;

  try
  {
    const profileInfo = await user.findOne({userHandle});

    const profileObj = await profile.findById(profileInfo.profile);

    return res.status(200).json({
      success: true,
      profile: profileObj, 
    })
  }catch(err){
    return res.status(500).json({
      success: false,
      message: 'Internal error while fetching user info',
    })
  }
}

exports.updateProfile = async (req , res) => {

  const userHandle = req.user.userHandle;

  const {data} = req.body;

  try{

    const person = await user.findOne({
        userHandle,
    })

    const profileInfo = await profile.findById(person.profile);

    for (const key in profileInfo) {
      if (data.hasOwnProperty(key) && data[key] !== undefined) {
        profileInfo[key] = data[key];
      }
    }

    profileInfo.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    })

  } catch(err){
    console.log(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }

}

