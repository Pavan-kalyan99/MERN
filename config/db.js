import mongoose from 'mongoose'

const connectDB=async()=>{
    try{
        const connect=await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongoose",connect.connection.host,connect.connection.name)

    }
    catch(err){
        console.log("error in mongoDb",err)
        
    }
}
//module.exports=connectDB
export default connectDB;
