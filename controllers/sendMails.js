const express=require("express")
const route=express.Router()
const nodemailer = require("nodemailer");


route.post('/sendMail',async(req, res)=>{
    console.log(req.body)
  const {email, subject, message, recieversEmail}= req.body

    // create reusable transporter object using the default SMTP transport
  let transporter = await nodemailer.createTransport({
    host:"localhost",
    service:"gmail",
    port: 3010,
    secure: false,
    auth: {
      user: "guche9@gmail.com", // generated ethereal user
      pass: "dgphjijafmzvtfoe", // generated ethereal password
    },
    tls:{
        rejectUnauthorized:false
    }
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Uchechukwu" <guche9@gmail.com>', // sender address
    to: recieversEmail, // list of receivers
    subject: subject, // Subject line
    // text: "Hello world?", // plain text body
    html: `<p>${message}</p>`,
  }).then(()=>{
    console.log("Message sent: %s, info.messageId");
    console.log("Preview URL: %s nodemailer.getTestMessageUrl(info)");
  })
  .catch((err)=> console.log(err))


})

  module.exports=route