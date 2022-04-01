const nodemailer = require("nodemailer");

module.exports = async (mailInformation) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const data = {
    from: process.env.MAIL_FROM,
    to: mailInformation.to,
    subject: mailInformation.subject,
    text: mailInformation.text,
  };

  await transporter.sendMail(data, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(info);
    }
  });
};
