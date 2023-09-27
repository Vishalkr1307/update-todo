const express=require("express")

const User=require("..//module/user")
const router=express.Router()
const newToken=require("..//util/token")
const newSendMail=require("..//util/sentMail")
const bcrypt=require("bcrypt")

router.post("",async (req,res)=>{
    try{

        let user=await User.findOne({user_name:req.body.user_name})
        
        if(!user){
            return res.status(400).send("User not found")
        }

        let match= user.checkPassword(req.body.password)
        if(!match){
            return res.status(400).send("Password incorrect")
        }
         let userOtp=await newSendMail(user._id.toString(),user.email)
         
        const token=newToken(user)
        

        return res.status(200).send({user,userOtp, token})

    

    }
    catch(err){
        return res.status(400).send("bad request")
    }
})
router.post("/forgetpassword",async (req,res)=>{
    try{

        let user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).send("user not found")
            
        }
        let userOtp=await newSendMail(user._id.toString(),user.email)

        return res.status(200).send(userOtp)
    }
    catch(err){
        return res.status(400).send("bad request")
    }


})
router.post("/reset-password/:id",async (req,res)=>{
    try{
        const userId=req.params.id
        const {newPassword}=req.body

        const hashPassword=bcrypt.hashSync(newPassword,8)

        const user=await User.findOneAndUpdate({_id:userId},{password:hashPassword})
        return res.status(200).send("Your password has been updated")



    }
    catch(err){
        return res.status(400).send("bad request")
    }
})

module.exports=router