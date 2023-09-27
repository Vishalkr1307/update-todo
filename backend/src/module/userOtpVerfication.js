const mongoose=require("mongoose");
const userOtpSchema=new mongoose.Schema({
    userId:String,
    otp:String,
    createdAt:String,
    expiresAt:String
},{
    versionKey:false,
    timestamps:true,
})

module.exports=mongoose.model("userOpt",userOtpSchema)