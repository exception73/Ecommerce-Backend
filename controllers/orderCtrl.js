import Order from "../model/Order.js";
import asyncHandler from 'express-async-handler';
import User from "../model/User.js";
import Product from "../model/Product.js";
import Stripe from 'stripe'
import dotenv from 'dotenv';
import Coupon from "../model/Coupon.js";
dotenv.config();


const stripe = new Stripe(process.env.STRIPE_KEY);


//@desc   create order
//@route  Post api/v1/orders 
//@access private 

export const createOrderCtrl = asyncHandler(async(req, res) => {
    //get the coupon
    const {coupon} = req?.query;

    const couponFound = await Coupon.findOne({
        code:coupon?.toUpperCase(),
    })
    if(couponFound?.isExpired){
        throw new Error("coupon has Expired");
    }
    if(coupon && !couponFound){
        throw new Error("coupon not found");
    }
    
    //get discount
    const discount = couponFound?.discount / 100;


    //get the payload(customer, orderItem, shippingAddress, totalPrice)
    const {orderItems, shippingAddress, totalPrice} = req.body;

    //find the user
    const user = await User.findById(req.userAuthId);
    if(!user?.hasShippingAddress){
        throw new Error("please provide a shipping address");
    }


    //check if order is not empty
    if(orderItems?.length <=0){
        throw new Error("no order itmes")
    }

    //place/create order and save into DB
    const order = await Order.create({
        user: user?._id,
        orderItems,
        shippingAddress,   
        totalPrice : couponFound ? totalPrice - totalPrice * discount: totalPrice,
    });

   
    //update thr product qty and product sold quantity
    const products = await Product.find({_id:{ $in :orderItems}});

    orderItems?.map(async(order) => {
        const product = products?.find((product) => {
            return product?._id?.toString() === order?._id?.toString();
        });

        if(product){
            product.totalSold += order.qty;
        }

        await product.save();
    })

     //push order innto user profile
     user.orders.push(order?._id);
     await user.save();
 

    //make payment (stripe)
    //payment k liye ek session create kr rhe h 
    /*
        paramteres: line_items, mode, success_url, cancel_url,
        mode-> the mode of checkout session, can have PAYMENT(one time payemtn),SETUP(save payemtn details to charnge you customer later), SUBSCRIPTION(use stripe billing to set up fiexed price subsritpions.);
    */

        const convertedOrders = orderItems.map((item) => {
            return {
                price_data: {
                    currency: "usd",
                    product_data:{
                        name: item?.name,
                        description: item?.description,
                    },
                    unit_amount: item?.price * 100,
                },
                quantity: item?.qty,
            }
        })

    const session = await stripe.checkout.sessions.create({
        line_items:convertedOrders,
        metadata:{
            orderId : JSON.stringify(order?._id),
        },
        mode: 'payment',
        //this is sent to session when payemnt is succees
        success_url: `http://localhost:3000/success`,
        //this thing is sent to the session when payment is canceled
        cancel_url: `http://localhost:3000/cancel`,

    });

    res.send({url:session.url})


   
})


//@desc    get all orders
//@route   get api/v1/orders
//@access  private
export const getAllordersCtrl = asyncHandler(async(req, res) => {
    const orders = await Order.find();
    res.json({
        success:true,
        message:"all Orders",
        orders,
    })
})

//@desc    get single order
//@route   get  api/v1/orders/:id
//@access  private/admin
export const getSingleOrderCtrl = asyncHandler(async(req,res) => {
    const id = req.params.id
    const order = await Order.findById(id);

    if(!order){
        throw new Error("order not found")
    }

    res.status(200).json({
        success: true,
        message: "single order",
        order,
    })
})

//@desc    update order to deliverd
//@route   PUt  api/v1/orders/update/:id
//@access  private/admin
export const updateOrderCtrl = asyncHandler(async(req, res) => {
    const id = req.params.id;
    const order = await Order.findById(id);

    if(!order){
        throw new Error("order not found")
    }

    const updatedOrder = await Order.findByIdAndUpdate(
        id,
        {
            status:req.body.status,
        },
        {
            new:true,
        }
    )

    res.status(200).json({
        success: true,
        message: "order updated",
        updatedOrder,
    });
});


//@desc    get sales sum of orders
//@route   GET /api/v1/orders/sales/sum
//@access  private/admin
export const getSalesSumCtrl = asyncHandler(async(req, res) => {
    //get order stats
    const Sales = await Order.aggregate([
        {
            $group:{
                _id: null,
                totalSales:{
                    $sum : "$totalPrice"
                },
                minimumSale:{
                    $min:"$totalPrice",
                },
                maximumSale:{
                    $max:"$totalPrice"
                },
                averageSale:{
                    $avg:"$totalPrice"
                }
            }
        }
    ]);  

    //get the date
    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const saleToday = await Order.aggregate([
        {
            $match:{
                createdAt:{
                    $gte:today,
                },
            },
        },
        {
            $group:{
                _id:null,
                totalSales:{
                    $sum:"$totalPrice"
                }
            }
        }
    ])
    
    res.status(200).json({
        success: true,
        message: "sum of orders",
        Sales,
        saleToday,
    })

})