const nodemailer = require("nodemailer");
const path = require("path");
// asyncHandler
const { asyncHandler } = require(path.join(
  __dirname,
  "..",
  "middlewares",
  "asyncHandler"
));

exports.authMailer = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Account Verification",
      text: "Thank you for registering your account.",
      html: `<a href=${process.env.URL}/verifyToken?token=${token}>${token}</a>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err.message);
    return;
  }
};

exports.resetPasswordMailer = async (email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: "Password reset",
      text: "Click here to reset your password.",
      html: `<a href=${process.env.URL}/resetPassword?token=${token}>${token}</a>`,
    };
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.log(err.message);
    return;
  }
};
