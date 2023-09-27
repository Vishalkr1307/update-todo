const express=require("express")
const cors=require("cors")
const app=express()
const User=require("./moduleController/register")
const Login=require("./moduleController/Login")
const Task=require("./moduleController/Product")
const verifyOtp=require("./moduleController/verifyOtp")
const passport=require("./config/passport")
const UserSchema=require("./module/user")
app.use(express.json())
app.use(cors())
const session=require("express-session")
const path = require("path")
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(passport.session())

passport.serializeUser(({user,token},done)=>{

  
 
    
    done(null,{userId:user._id,token})

})
passport.deserializeUser(async ({userId,token},done)=>{
 
  const user= await UserSchema.findOne({_id:userId}).lean().exec()
  
       
    done(null,{user,token})

})

app.use("/register",User)
app.use("/login",Login)
app.use("/tasks",Task)
app.use("/register",verifyOtp)
app.use("/login",verifyOtp)



app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login',successRedirect: '/auth/google/success'}),
   (req,res)=>{
    const {user,token}=req.user
    


    return res.status(200).send({user,token})

  }
  
  
  );
app.get("/auth/google/success", (req,res)=>{
  
     const {user,token}=req.user
    
    return res.status(200).redirect('http://localhost:3000');

})

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports=app

