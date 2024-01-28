const dotenv=require('dotenv')
const mongoose=require('mongoose')
dotenv.config();


const connectDB=async()=>{
    try{
        await mongoose.connect(process.env.mongoURL)
    }
    catch(err){
        console.log(err)
    }
   
}
module.exports=connectDB