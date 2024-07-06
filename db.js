const mongoose = require('mongoose');
require('dotenv').config()

//local host
const mongoURL = process.env.MONGODB_URL_LOCAL;
//online mongodb server
// const mongoURL = process.env.MONGODB_UR;

mongoose.connect(mongoURL,{
    useNewUrlParser: true
})

const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to Mongoose Server Successfully");
})

db.on('error',(err)=>{
    console.log("Error : ",err);
})

db.on('disconnected',()=>{
    console.log("MongoDB Disconnected");
})

module.exports = db;

