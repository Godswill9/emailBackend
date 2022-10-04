require("dotenv").config();
const express=require('express')
const app=express()
const database=require('./controllers/database')
const login=require('./controllers/login')
const signup=require('./controllers/signup')
const cors=require("cors")
const cookieParser=require("cookie-parser")
const bodyParser=require("body-parser")
const sendMail=require('./controllers/sendMails')


app.use(cors({
    origin:["https://email-fsx2.onrender.com"],
    methods:["GET", "POST", "PUT", "DELETE"],
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());




app.use('/api', login)
app.use('/api', signup)
app.use('/api', sendMail)

app.listen(process.env.PORT || 3010, ()=>{
    console.log(`app is listening`)
})


