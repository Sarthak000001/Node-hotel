const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem')


// POST route to add menu item
router.post('/', async(req,res) =>{
    try{
        const data = req.body;
        const newMenuItem = new MenuItem(data);
        const response = await newMenuItem.save();
        console.log('menu data saved');
        res.status(200).json(response);
    }
    catch(err){
        console.log('Error');
        res.status(500).json({err:'Internal server error'});
    }
});

// GET method for getting menu items
router.get('/',async(req,res) =>{
    try{
        const menuItems = await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(menuItems);
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
});

router.get('/:tasteType',async(req,res) =>{
    try{
        
        const tasteType = req.params.tasteType;
        if(tasteType=='sweet' || tasteType=='spicy' || tasteType=='sour'){
            const response = await MenuItem.find({taste:tasteType});
            console.log('response fetched');
            res.status(200).json(response);
        }else{
            res.status(400).json({err:'Invalid taste type'})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
});

// create -> post()
// read -> get()
// update -> put()/patch()
// delete -> delete()

// update menu item 
router.put('/:id',async(req,res)=>{
    try{
        const menuItemId = req.params.id;
        const menuItemData = req.body;

        const response = await MenuItem.findByIdAndUpdate(menuItemId,menuItemData,{
            new:true,
            runValidators:true
        });

        if(!response){
            return res.status(404).json({err:'Menu Item is invalid'})
        }
        console.log('data updated')
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
})

// delete Menu Item 
router.delete('/:id',async(req,res)=>{
    try{
        const menuItemId = req.params.id;

        const response = await MenuItem.findByIdAndDelete(menuItemId);
        if(!response){
            return res.status(404).json({err:'Menu Item is invalid'});
        }
        console.log('Menu Item deleted Successfully');
        res.status(200).json({message:'Menu Item deleted Successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({err:'Internal server error'});
    }
})
module.exports = router;