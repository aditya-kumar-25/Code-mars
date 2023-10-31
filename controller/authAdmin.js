const admin = require("../models/adminSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
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

    let findAdmin = await admin.findOne({ email });

    if (await bcrypt.compare(password, findAdmin.password)) {
      // passwaord match

      const payload = {
        admin: findAdmin.email,
        id: findAdmin._id,
        ok: true,
      };

      let token = jwt.sign(payload, process.env.JWT_SECRET_ADMIN, {
        expiresIn: "2h",
      });

      findAdmin = findAdmin.toObject();
      findAdmin.token = token;
      findAdmin.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.header("Authorization", `Bearer ${token}`);

      return res.cookie("token", token, options).status(200).json({
        success: true,
        token: token,
        admin: findAdmin,
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

exports.addAdmin = async (req, res) => {
  const { email, password } = req.body;

  const checkAdmin = await admin.findOne({ email });

  if (checkAdmin) {
    console.log("User already exists:");
    return res.status(403).json({
      success: false,
      message: "User already exists",
    });
  }

  let hashPassword = await bcrypt.hash(password, 10);

  try {
    await admin.create({
      email,
      password: hashPassword,
    });
  } catch (err) {
    console.log("Error in creating admin:", err);
    return res.status(404).json({
      success: false,
      message: "Error in creating admin!",
    });
  }
};
