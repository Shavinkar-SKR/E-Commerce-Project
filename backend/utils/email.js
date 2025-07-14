const nodemailer = require("nodemailer"); //import nodemailer to send emails
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const sendEmail = catchAsyncErrors(async (options) => {
  const transport = {
    //email transport configuration using environment variables. transport is an object defining how the email will be sent
    host: process.env.SMTP_HOST, //host is your SMTP server
    port: process.env.SMTP_PORT, //port is the number on which the SMTP server listens
    auth: {
      user: process.env.SMTP_USER, //auth holds login credentials for the email service you're using
      pass: process.env.SMTP_PASS,
    },
  };

  const transporter = nodemailer.createTransport(transport); //creates a transporter object using nodemailer
  //It uses the transport configuration to connect to the SMTP server and handle email delivery

  const message = {
    //message object holds the details of the email.
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //to, subject, and text are provided dynamically through the options parameter passed to the sendEmail function

  await transporter.sendMail(message);
});

module.exports = sendEmail;
