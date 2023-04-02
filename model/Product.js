import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    brand:{
        type:String,
        required:true,
    },
    category:{
        type:String ,
        ref:"Category",
        required:true,
    },
    sizes:{
        type:[String],
        enum:["S","M","L","XL","XXL"],
        required:true,
    },
    colors:{
        type:[String],
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },

    images:[
        {
            type:String,
            default:"https://via.placeholder.com/150",
        },
    ],

    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review",
        }
    ],

    price:{
        type:Number,
        required:true,
    },

    totalQty:{
        type:Number,
        required:true,
    },

    totalSold:{
        type:Number,
        required:true,
        default:0,
    },
},
    {
        timestamps:true,
        toJSON:{virtuals : true},
    }
    );

    //virtuals

    //qty left
    ProductSchema.virtual('qtyLeft').get(function(){
        const product = this;
        return product.totalQty - product.totalSold;
    })

    //total rating   
    ProductSchema.virtual('totalReviews').get(function() {
        const product = this;
        return (product?.reviews?.length);
    })

    //average rating
    ProductSchema.virtual('averageRating').get(function() {
        let ratingsTotal = 0;
        const product = this;
        product?.reviews?.forEach(function(review){
            ratingsTotal += review?.rating;
        })
        const averageRating = ratingsTotal / product?.reviews?.length;
        return averageRating ;
    })

export default mongoose.model("Product",ProductSchema);