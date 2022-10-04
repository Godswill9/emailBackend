const express=require("express")
const route=express.Router()
const {signup}=require('./auth')

route.post('/signup', signup)


module.exports=route