import mongoose from "mongoose";
const orderSchema =new mongoose.Schema(
  {
  product: [
    {
    type:mongoose.ObjectId,
    ref:'Products',
},
],
  payment:{},
  buyer:{
    type:mongoose.ObjectId,
    ref:'customers',

  },
  status:{
    type:String,
    default:'not process',
    enum:['Not process','processing','Shipped','delivered','Cancel'],


  },
  

  

},{timestamps:true}
);

export default mongoose.model('Order',orderSchema);
