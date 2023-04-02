import asyncHandler from "express-async-handler";
import Coupon from "../model/Coupon.js";

export const createCouponCtrl = asyncHandler(async (req, res) => {
  const { code, startDate, endDate, discount } = req.body;
  //check if admin
  //check is coupon already exists
  const couponsExists = await Coupon.findOne({
    code,
  });
  if (couponsExists) {
    throw new Error("coupon already exists");
  }
  if (isNaN(discount)) {
    throw new Error("discount value must be a number");
  }

  const coupon = await Coupon.create({
    code: code?.toUpperCase(),
    startDate,
    endDate,
    discount,
    user: req.userAuthId,
  });
  res.status(201).json({
    status: "success",
    message: "coupon created successfully",
    coupon,
  });
});

export const getAllCouponsCtrl = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({
    status: "success",
    coupons,
  });
});


export const getCouponCtrl = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if(!coupon){
        throw new Error("Coupon not found");
    }
    res.json({
        status:"success",
        message:"coupon fetched",
        coupon,
    })
})

export const updateCouponCtrl = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if(!coupon){
        throw new Error("Coupon not found");
    }
    const {code, startDate, endDate, discount} = req.body;
    await Coupon.findByIdAndUpdate(req.params.id,{
        code: code?.toUpperCase(),
        startDate,
        endDate,
        discount,
    },{
        new:true,
    })

    res.json({
        status:"success",
        message:"coupon updated successfully",
        coupon,
    })
    
})

export const deleteCouponCtrl = asyncHandler(async(req, res) => {
    const coupon = await Coupon.findById(req.params.id);
    if(!coupon){
        throw new Error("Coupon not found");
    }

    await Coupon.findByIdAndDelete(req.params.id);

    res.json({
        status:"success",
        message: "Coupon deleted successfully",
        coupon,
    })
})