import mongoose from "mongoose";
const schema = new mongoose.Schema({ actorEmail:{type:String,required:true,lowercase:true,index:true}, action:{type:String,required:true,index:true}, targetId:{type:String,default:""}, details:{type:String,default:""}, ip:{type:String,default:""} },{timestamps:true});
export default mongoose.model("AdminAudit",schema);
