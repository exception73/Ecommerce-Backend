import Brand from "../model/Brand.js";
import asyncHandler from "express-async-handler";



//@desc     create a new brand
//@route    Post /api/v1/brand
//@access   Private/Admin

export const createBrandCtrl = asyncHandler(async (req, res) => {
    let { name } = req.body;
    name = name.toLowerCase();
    const brandFound = await Brand.findOne({ name });
    if (brandFound) {
      throw new Error(`Brand ${name} already exists`);
    }
  
    //create
    const brand = await Brand.create({
      name:name.toLowerCase(),
      user: req.userAuthId,
    });
  
    res.json({
      status: "success",
      message: "brand created successfully",
      brand,
    });
  });
  
  //@desc     get all brand
  //@route    GET /api/v1/brand 
  //@access   Public
  
  export const getAllBrandCtrl = asyncHandler(async (req, res) => {
    const brand = await Brand.find({});
    res.json({
      success: true,
      brand,
    });
  });
  
  //@desc     get single brand
  //@route    GET /api/v1/brand/:id
  //@access   Public
  
  export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) throw new Error(`Cannot find brand`);
  
    res.json({
      success: true,
      brand,
    });
  });
  
  //@desc     udpate brand
  //@route    PUT /api/v1/brand/:id
  //@access   Private/admin
  
  export const updateBrandCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
    
    const brand = await Brand.findByIdAndUpdate(req.params.id, { name }, {new: true,});
    if(!brand){
      throw new Error("brand not found");
    }
    res.json({
      status:"success",
      message:"brand updated successfully",
      brand,
    })
  });
  
  
  //@desc     delete brand
  //@route    delete /api/v1/brand/:id
  //@access   Private/admin
  
  export const deleteBrandCtrl = asyncHandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    
    if(!brand){
      throw new Error(`brand not found`)
    }
      await Brand.findByIdAndDelete(req.params.id);
      
      res.json({
          status:"Success",
          message:"brand deleted successfully"
      })
    });