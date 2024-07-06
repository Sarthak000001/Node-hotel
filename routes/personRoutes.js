const express = require('express');
const router = express.Router();
const Person = require('../models/Person')
const {jwtAuthMiddleware,generateToken} = require('../jwt')

// POST route to add a person
router.post('/signup',async (req,res) =>{
    try{
        const data = req.body;
        if(data.email === null || data.email === ''){
            return res.status(400).json('Email field required');
        }
        //create new person document using mongoose model
        const newPerson = new Person(data);

        //save new-person to the database
        const response = await newPerson.save();
        console.log('Person data saved');

        const payload = {
            id: response.id,
            username: response.username
        }
        const token = generateToken(payload);
        console.log('Token is : ',token);
        // response with only necessary fields
        res.status(200).json({response:response,token:token});
    }catch(err){
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Duplicate key error: Email must be unique' });
        }
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
});

// Login Route 
router.post('/login',async(req,res)=>{
    try{
        // Extract username and password from request body 
        const {username,password} = req.body;

        // find the user by username 
        const user = await Person.findOne({username:username});

        // If user doesn't exist or password does not match,return error 
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error:'Invalid username or Password'});
        }
        // generate token 
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);
        // return token as response 
        res.json({token});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

// Profile route 
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try{
        const userData = req.user;
        
        const userId = userData.id;
        const user = await Person.findById(userId);
        
        res.status(200).json({user});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
})

router.get('/',jwtAuthMiddleware,async(req,res) =>{
    try{
        const data = await Person.find();
        res.status(200).json(data);
    }catch(err){
        res.status(500).json({err:'Internal server error'});
    }
});

//use parameterized way
// :workType -> means declaring variable workType
router.get('/:workType',async(req,res)=>{
    try{
        const workType = req.params.workType; //extract the workType from URL parameter
        if(workType == 'chef' || workType == 'manager' || workType == 'waiter'){
            const response = await Person.find({work:workType});
            console.log('response fetched');
            res.status(200).json(response);
        }else{
            res.status(404).json({err:'Invalid work type'});
        }
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
})

// update person record
router.put('/:id',async(req,res)=>{
    try{
        const personId = req.params.id; //extract id from URL parameter
        const personData = req.body; //update data for the person

        const updateResponse = await Person.findByIdAndUpdate(personId,personData,{
            new:true, //return updated document
            runValidators:true //run mongoose validation
        });

        if(!updateResponse){
            return res.status(404).json({err:'Person not found'});
        }

        console.log('data updated');
        res.status(200).json(updateResponse);
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
})

// delete Person record
router.delete('/:id',async(req,res)=>{
    try{
        const personId = req.params.id;

        const deleteResponse = await Person.findByIdAndDelete(personId);
        if(!deleteResponse){
            return res.status(404).json({err:'Person not found'})
        }
        res.status(200).json({message: 'Person Deleted Successfully'})
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
})
module.exports = router;