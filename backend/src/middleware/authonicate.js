const jwt=require("jsonwebtoken")
require("dotenv").config()

const verifyToken=(token)=>{
    return new Promise((resolve, reject)=>{
        jwt.verify(token,process.env.PRIVATE_KEY,(err,decoded)=>{
            if(err){
                reject(err)
            }
            resolve(decoded)
        })
    })
}

module.exports= async (req,res,next)=>{
    try{

        if(!req?.headers?.authorization) return res.status(400).send("please provide authorization token")
        const bearerToken=req.headers.authorization
        if(!bearerToken.startsWith("Bearer")) return res.status(400).send("bearer token")
        const token=bearerToken.split(" ")[1]

        let user;
        user=await verifyToken(token)
        req.user=user.user
        
        next()
        
    }
    catch(err){
        return res.status(400).send(err)
    }



}