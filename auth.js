//implementing authentication
const passport = require('passport')
const LocalStrategy = require('passport-local') //also called as username-passport strategy
const Person = require('./models/Person')

//authentication
passport.use(new LocalStrategy(
    async(USERNAME,PASSWORD,done)=>{
        try{
            // console.log('Received credentials',USERNAME,PASSWORD);
            const user = await Person.findOne({username:USERNAME});
            if(!user)
                return done(null,false,{message : 'Incorrect username'})
            const isPasswordMatch = user.comparePassword(PASSWORD);
            if(isPasswordMatch){
                return done(null,user);
            }else{
                return done(null,false,{message:'Incorrect password'})
            }

        }catch(err){
            return done(err);
        }
    }
));

module.exports = passport;