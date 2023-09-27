const app=require("..//index")
const connect=require("..//config/db")
require("dotenv").config()

const port=process.env.PORT||8080

app.listen(port, async (req,res)=>{
    await connect()
    // window.location.href=`http:/localhost:${port}`
    console.log(`Connect to ${port}`)
})