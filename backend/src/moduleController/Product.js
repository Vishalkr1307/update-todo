const express=require("express")

const Product=require("..//module/product")

const router=express.Router()
const authenciate=require("..//middleware/authonicate")

router.post("",authenciate,async (req,res)=>{
    try{

        let task=await Product.create(req.body)
        return res.status(200).send(task)

    }
    catch(err){
        return res.status(400).send(err)
    }
})
router.get("",async (req,res)=>{
    try{

        let task=await Product.find().lean().exec()
        return res.status(200).send(task)

    }
    catch(err){
        return res.status(400).send(err)
    }
})
router.get("/:id",async (req,res)=>{
    try{

        let task=await Product.findById(req.params.id).lean().exec()
        return res.status(200).send(task)

    }
    catch(err){
        return res.status(400).send(err)
    }
})
router.put("/:id",async (req,res)=>{
    try{

        let task=await Product.findByIdAndUpdate(req.params.id,req.body).lean().exec()
        let updateTask=await Product.findById(req.params.id).lean().exec()

        return res.status(200).send(updateTask)

    }
    catch(err){
        return res.status(400).send(err)
    }
})
router.patch("/:id",async (req,res)=>{
    try{

        let task=await Product.findByIdAndUpdate(req.params.id,req.body).lean().exec()
        let updateTask=await Product.findById(req.params.id).lean().exec()

        return res.status(200).send(updateTask)

    }
    catch(err){
        return res.status(400).send(err)
    }
})
router.delete("/:id",async (req,res)=>{
    try{

        let task=await Product.findByIdAndDelete(req.params.id).lean().exec()
        return res.status(200).send(task)

    }
    catch(err){
        return res.status(400).send(err)
    }
})
module.exports= router