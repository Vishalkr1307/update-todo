const express=require("express")

const UserOptVerfication=require("../module/userOtpVerfication")
const User=require("../module/user")

const router=express.Router()
const bcrypt=require("bcrypt")
const sendMail=require("..//util/sentMail")

router.post("/verifyotp/:id",async (req,res)=>{
    try{
        const {otp}=req.body
        const userId=req.params.id
        if(!userId || !otp){
            return res.status(400).send("please enter userId and otp")

        }
        else{
            let userOtpData=await UserOptVerfication.find({userId:userId}).lean().exec()
            
            if(userOtpData.length<=0){
              
               return  res.status(400).send("userId doest not exist")
                
            }
            else{
                let {expiresAt}=userOtpData[0]
                let hashotp=userOtpData[0].otp
                
                
                
                if(expiresAt<Date.now()){
                   
                    await UserOptVerfication.deleteMany({userId:userId})
                    return res.status(400).send("Your otp has been expires")
                }
                else{
                    
                    const checkOtp=bcrypt.compareSync(otp,hashotp)
                    
                    if(!checkOtp){
                        return res.status(400).send("you otp has Invalid")
                    }
                    else{
                        
                        await User.updateOne({_id:userId},{verify:true})
                        await UserOptVerfication.deleteMany({userId})

                        return res.status(200).send({
                            status:"Verified",
                            message:"user Email verifyed successfully"
                        })

                    }

                }
            }
        }

    }
    catch(err){
        return res.status(400).send("bad request");
    }
})

router.post("/resendverifyotp",async (req,res)=>{
    try{
        const {userId,email}=req.body
        
        
        if(!userId || !email){
            

            return res.status(400).send("userId is required and otp is required")
        }
        else{

            
            await UserOptVerfication.deleteMany({userId})
             let otpData =await sendMail(userId,email)

            return res.status(200).send(otpData)

            


        }

    }
    catch(err){
        return res.status(400).send("bad request")
    }
})

module.exports=router