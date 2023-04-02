import mongoose, { Schema } from 'mongoose';

const CouponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:true,
    },
    startDate:{
        type:Date,
        required:true,
    },
    endDate:{
        type:Date,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
        default:0,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }
},{
    timestamps:true,
    toJSON:{virtuals : true},
})

 
//coupon is expired
CouponSchema.virtual('isExpired').get(function(){
     return this.endDate < Date.now();
})

CouponSchema.virtual('daysLeft').get(function(){
    const daysLeft = Math.ceil((this.endDate-Date.now())/(1000 * 60 *60 *24 )) + " days left"
    return daysLeft;
})


//validation 
CouponSchema.pre("validate", function(next){
    if(this.startDate < Date.now()){
        next(new Error("start date cannot be less than today"))
    }
    next();
})

CouponSchema.pre("validate", function(next){
    if(this.endDate < Date.now()){
        next(new Error("end date cannot be less than today"))
    }
    next();
})

CouponSchema.pre("validate", function(next){
    if(this.discount <= 0 || this.discount>100){
        next(new Error("discount cannot be less than 0 or greater than 100"))
    }
    next();
})


export default mongoose.model("Coupon",CouponSchema);