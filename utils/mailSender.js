const nodemailer = require("nodemailer");

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "pcajourney123@gmail.com",
        pass: process.env.epass, // Make sure 'epass' is defined in your environment variables
      },
    });

    try {
      const info = await transporter.sendMail({
        from: "pcajourney123@gmail.com",
        to: email,
        subject: title,
        html: `${body}`,
      });
      console.log("Message sent: %s", info);
    } catch (err) {
      console.log("Error: ", err);
    }
  } catch (err) {
    console.log("Error while creating transporter: ", err);
  }
}; 

module.exports = mailSender;