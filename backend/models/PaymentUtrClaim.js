import mongoose from "mongoose";
const schema=new mongoose.Schema({utrNormalized:{type:String,required:true,unique:true,index:true},orderId:{type:String,required:true,index:true},user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}},{timestamps:true});
export default mongoose.model("PaymentUtrClaim",schema);
