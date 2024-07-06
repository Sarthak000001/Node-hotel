const express = require('express')
const app = express()
const db = require('./db')
const bodyparser = require('body-parser') 
// import person router files
const personRoute = require('./routes/personRoutes')
const menuItemRoute = require('./routes/menuItemRoutes')
require('dotenv').config()
const PORT = process.env.PORT || 3000;//middle layer
const passport = require('./auth')

// Middleware Function 
const logRequest = (req,res,next) =>{
    console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
    next(); //move on to the next phase i.e. to the next middleware function if present 
}

app.use(bodyparser.json()); 
app.use(logRequest);
app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local',{session:false});

app.get('/',(req, res) => res.send('Welcome to Our Hotel!'))
// ->When we want to add middleware to only specify endpoint :2nd parameter
// app.get('/',logRequest ,(req, res) => res.send('Welcome to Our Hotel!'))


app.use('/person',personRoute);
app.use('/menu',menuItemRoute)


app.listen(PORT, () => console.log(`app listening on port ${PORT}!`))