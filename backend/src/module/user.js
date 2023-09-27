const mongoose=require("mongoose")
const bcrypt=require("bcrypt")

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    user_name:{type:String,required:true},
    phone:{type:Number,required:true},
    description:{type:String,required:true},
    verify:{type:Boolean,default:false},
},{
    versionKey:false,
    timestamps:true
})

userSchema.pre("save",function(next){
    if(!this.isModified("password")) return next();
    this.password=bcrypt.hashSync(this.password,8)
    next()

})
userSchema.methods.checkPassword=function(password){
    return bcrypt.compareSync(password,this.password)
}

module.exports=mongoose.model("User",userSchema)
