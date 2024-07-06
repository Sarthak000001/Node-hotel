const express = require('express');
const router = express.Router();
const Person = require('../models/Person')

// POST route to add a person
router.post('/',async (req,res) =>{
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

        // response with only necessary fields
        res.status(200).json(response);
    }catch(err){
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Duplicate key error: Email must be unique' });
        }
        console.log(err);
        res.status(500).json({error:'Internal server error'});
    }
});

router.get('/',async(req,res) =>{
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