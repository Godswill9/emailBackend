const express = require("express");
const router = express.Router();
const database = require("./database");
const { v4 } = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const sendOtp=async()=>{
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
        html: `<h1>${message}</h1>`,
    }).then(()=>{
        console.log("Message sent: %s, info.messageId");
        console.log("Preview URL: %s nodemailer.getTestMessageUrl(info)");
    })
    .catch((err)=> console.log(err))
}

//registration
const signup=async(req, res, next)=>{ 
    const { firstName, lastName, email, password, checked, phone } = req.body;
  var date=new Date()
  var id = v4();
  var salt = await bcrypt.genSalt(10);
  var hashed = await bcrypt.hash(password, salt);

  var check = "SELECT * FROM userdata WHERE email = ?";
  database.query(check, [email], (err, result) => {
    if (result.length !== 0) {
      console.log("user already exists");
      res.json({ message: "user already exists" , redirect:"true"});
      return;
    } else {
      var sql = `INSERT INTO userdata (firstName,lastName, email, password, ID, phone) VALUES?`;
      var values = [[firstName, lastName, email, hashed, id, phone]];
      database.query(sql, [values], function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.json({ message: "user registered" });
      });

      //sentEmails
      var sql = `INSERT INTO sentemails (ID, 
         message, 
         email,
         date
         ) VALUES?`;
        var values1 = [[id,"", "", date]];
        database.query(sql, [values1], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
        });

        //pendingEmails
      var sql = `INSERT INTO pendingemails (date, 
         message, 
         sendersEmail,
         id,
         sendersName
         ) VALUES?`;
        var values2 = [[date,"","", id, ""]];
        database.query(sql, [values2], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + result.affectedRows);
        });
    }
  });
} 
  


// login route 
const login=async(req, res, next)=>{
  const { email, password } = req.body;
//   console.log(req.body)
  var check = "SELECT * FROM userdata WHERE email = ?";
  database.query(check, [email], async (err, result) => {
    if (result.length == 0) {
      res.json({ message: "user not found" , bool:"false"});
    }
     else {
    //   console.log(result[0].password);
      await bcrypt.compare(password, result[0].password)
     .then((resultt) => {
        if (!resultt) res.json({ message: "incorrect password", bool:"false" })
        if(resultt){
          const accessToken = jwt.sign(
            {
              username: result[0].email,
              id: result[0].id,
              firstName: result[0].firstName,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
          )
        //   res.cookie("jwt", accessToken, {
        //     withCredentials:true,
        //     httpOnly: true,
        //     maxAge: 3600 * 1000 * 24 * 365 * 100,
        //     // secure: true
        // })
              const allObj = {
                ...result[0],
                accessToken: accessToken,
                status: "success",
                bool:"false", 
                redirect:"true"
              };
              res.json(allObj);
            var checkAccount=`Select * from account WHERE email=?`
            database.query(checkAccount,[email], async(err, result)=>{
            })
  
        }
      })


    //   // }
    }
  });
}



// // VERIFY TOKEN
// const verifyToken=(req, res, next)=>{
//   const cookieToken=req.cookies.jwt
//   // console.log(req.cookies)
//   if(!cookieToken) return res.send(401)
//     jwt.verify(cookieToken, process.env.ACCESS_TOKEN_SECRET, async(err, decoded)=>{
//       if(err) {console.log(err)
//       res.json({status:false})
//   }else{
//     var check = "SELECT * FROM mymonicustomers WHERE email = ?";
//     database.query(check, [decoded.username], (err, result) => {
//       if (result.length>0) {
//         // console.log(result)
//       {res.json({status:true, id: result[0].id, firstName: result[0].firstName, email: result[0].email}) 
//       }}})
//   }
//     })
    
// }
module.exports = {signup, login};
