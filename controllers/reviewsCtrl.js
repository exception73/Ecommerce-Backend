import Review from "../model/Review.js";
import asyncHandler from 'express-async-handler'
import Product from "../model/Product.js";

//@desc     Create new review  
//@route    POST /api/v1/reviews 
//@access   Private/Admin  

export const createReviewCtrl = asyncHandler(async(req, res) => {

    const{product, message, rating} = req.body;
    // find the product
    const productFound = await Product.findById(req.params.productId).populate('reviews');
    if(!productFound){ throw new Error(`Product ${req.params.productId} not found`); }

    //check is user already reviewd this product
    const hasReviewed = productFound?.reviews?.find((review) => {
        return review?.user?.toString() === req?.userAuthId?.toString();
    });

    if(hasReviewed){
        throw new Error("you have already reviewed this product")
    }

    
    //create review
    const review = await Review.create({
        message,
        rating,
        product:productFound?.id,
        user:req.userAuthId,
    });

    //push review into product found
    productFound.reviews.push(review?.id);
    await productFound.save();

    res.status(201).json({
    
        success:true,
        message:"review created successfully"
      
    })


})