const  GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport=require("passport")
const User=require("..//module/user")
const { v4: uuidv4 } = require('uuid')
require("dotenv").config()
const newToken=require("..//util/token")

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:2345/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    let user=await User.findOne({email:profile._json.email}).lean().exec()

    if(!user){
        user=await User.create({name:profile._json.name,email:profile._json.email,password:uuidv4(),user_name:profile._json.name,phone:null,description:"Write the description",verify:true})
    }
    const token=newToken(user)
    
    cb(null,{user,token})
  }
));
module.exports=passport