const express=require("express")
const User=require("..//module/user")
const router=express.Router()
const {body,validationResult}=require("express-validator")
const errorOfArray=require("..//util/valdation")
const sendMail=require("..//util/sentMail")


const createEmailChain=()=>body("email").isEmail().withMessage("please provide a valid email")
const passwordChain=()=>body("password").isLength({min:5}).withMessage("password must be at least 5 characters")
const phoneChain=()=>body("phone").isLength({min:10, max:10}).withMessage("phone must be at least 10 characters")
const descriptionChain=()=>body("description").isLength({min:10, max:100}).withMessage("description must be at least 100 characters")

router.post("",passwordChain(),createEmailChain(),phoneChain(),descriptionChain(),async (req,res)=>{
    try{

        let error=validationResult(req)
        if(!error.isEmpty()){
            return res.status(400).send(errorOfArray(error.array()).join(","))
        }

        let userName=await User.findOne({user_name:req.body.user_name})
        if(userName){
            return res.status(400).send("userName also exists, please try Other ")
        }

        let user=await User.create(req.body)

        let userOtpData=await sendMail(user._id.toString(),req.body.email)
        

        

        return res.status(200).send(userOtpData)

    }
    catch(err){
        
        return res.status(400).send(err)
    }
})
router.get("/:id",async (req,res)=>{
    try{
        let user=await User.findById(req.params.id).lean().exec()

        return res.status(200).send(user)

    }
    catch(err){
        return res.status(400).send(err)
    }
})

module.exports=router