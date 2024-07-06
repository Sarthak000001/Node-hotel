const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//define the person schema
const personSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    age:{
        type:Number
    },
    work:{
        type:String,
        require:true,
        enum:['chef','manager','waiter']
    },
    mobile:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true,
    },
    address:{
        type:String
    },
    salary:{
        type:Number,
        require:true
    },
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    }
});

personSchema.pre('save',async function(next){
    const person = this;
    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();
    try{
        // hash the password generation 
        const salt = await bcrypt.genSaltSync(10);

        // hash password 
        const hashPassword = await bcrypt.hashSync(person.password,salt);

        // Override the plain password with hashed one
        person.password = hashPassword;
        next();
    }catch(err){
        return next(err);
    }
})

personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // use bcrypt to compare  the provided password with the hashed password 
        const isMatch = await bcrypt.compare(candidatePassword,this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}
//create person model
const Person = mongoose.model('Person',personSchema);
module.exports = Person;


