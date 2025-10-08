const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

exports.sendConfirmationEmail = async (user, newEmail) => {
  const token = jwt.sign(
    { id: user.id, newEmail },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const confirmUrl = `${process.env.CLIENT_URL}/api/v1/user/confirm-email/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "reemsina2@gmail.com",
      pass: "yhin zubj ecgs evez",
    },
  });

  await transporter.sendMail({
    from: "reemsina2@gmail.com",
    to: newEmail,
    subject: "Confirm your new email",
    html: `<p>Click <a href="${confirmUrl}">here</a> to confirm your new email.</p>`,
  });
};


exports.sendCodeEmail = async ( newEmail,message) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "reemsina2@gmail.com",
      pass: "yhin zubj ecgs evez",
    },
  });

  await transporter.sendMail({
    from: "reemsina2@gmail.com",
    to: newEmail,
    subject: "Reset your password",
    html: `<p>${message}</p>`,
  });
};