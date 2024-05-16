const nodemailer = require("nodemailer");
require("dotenv").config();
const SendEmail = async (email, title, body) => {
  console.log("Inside mail sender ", email);
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    // console.log("Trasdfhf###########=>", transporter);
    let information = await transporter.sendMail({
      from: `Netflix Clone`,
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
    });
    console.log("email status", information);
    return information;
  } catch (error) {
    console.log("Error Occured while sending email");
    // process.exit(1);
  }
};

module.exports = SendEmail;
