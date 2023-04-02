import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    
},{
    timestamps:true
})

export default mongoose.model("Color",colorSchema);