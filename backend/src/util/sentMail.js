const nodemailer=require("nodemailer")
const bcrypt=require("bcrypt")
const MailGen=require("mailgen")
require("dotenv").config()
const User=require("..//module/user")

const userOtpVerfication=require("..//module/userOtpVerfication")


module.exports=async (id,email)=>{
   
    const transporter =await nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:process.env.AUTH_EMAIL,
            pass:process.env.AUTH_PASSWORD
        }

    })

    const otp=Math.floor(1000+Math.random()*9000)
    const hashOtp=bcrypt.hashSync(otp.toString(),8)

    const newUserOtpVerification=await new userOtpVerfication({
        userId:id,
        otp:hashOtp,
        createdAt:Date.now(),
        expiresAt:Date.now() +3600000
    })
    await newUserOtpVerification.save()

    let user=await User.findOne({_id:id}).lean().exec()
    

    const mailGenerator=new MailGen({
        theme:"default",
        product:{
            name: 'Masai-School',
            link: 'https://localhost:2345'
        }

    })

    const emailData={
        body:{
            name:user.name,
            intro:'Welcome to masaiProject ! we\'re very excited to have on board ',
            action:{
                instructions:"To started with masaiProject,your otp is now",
                button:{
                    color:'#22BC66',
                    text:otp

                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    var emailBody=mailGenerator.generate(emailData)
    var emailText=mailGenerator.generatePlaintext(emailData)
    

    const info=await transporter.sendMail({
        from:process.env.AUTH_EMAIL,
        to:email,
        subject:"OtpVerification",
        text:emailText,
        html:emailBody
    })
    
    return {
        status:`opt send to ${email}`,
        messageId:info.messageId,
        userId:id,
        email:email,
    }



    
}
