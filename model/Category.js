import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    products:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product",
        },
    ],
},{
    timestamps:true
});

export default mongoose.model("Category",categorySchema);
