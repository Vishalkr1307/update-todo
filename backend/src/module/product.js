const mongoose=require("mongoose")

const productSchema=new mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    task_status:{type:String, required:true},
    tags:[String],
    subTasks:[{subTaskTittle:{type:String, required:true},status:{type:Boolean, required:true}}]


})

module.exports=mongoose.model("Task",productSchema)