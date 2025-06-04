const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const sendEmail = asyncHandler(async (data, req, res) => {
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_ID , // generated ethereal user
        pass: process.env.MP, // generated ethereal password
    },
    });
    let info = await transporter.sendMail({
        from: '"Hey" <abc@gmail.com>',
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
module.exports = { sendEmail };