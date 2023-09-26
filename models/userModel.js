import mongoose from "mongoose";

const userSchema =mongoose.Schema({
    name:{
     type:String,
     required:[true,"please add the username"],
     trim:true
    },
    email:{
     type:String,
     required:[true,"please add email"],
     unique:[true,'email address already taken']
    },
    password:{
     type:String,
     required:[true,'please add user password'],
    },
    phone:{
        type:String,
        required:true
    },
   
    role:{
        type:Number,
        default:0
    }
 
 
 
 },{
     timestamps:true,
 })
 export default mongoose.model('customers',userSchema)