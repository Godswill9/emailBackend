const mysql=require("mysql2")

const connectDb=mysql.createConnection({
    host:process.env.HOST,
    port:5445,
    user:process.env.USER,
    database:process.env.DATABASE,
    password:process.env.PASSWORD,
})
connectDb.connect((err)=>{
    if(err) console.log(err)
    console.log("connected to database")
})

module.exports=connectDb