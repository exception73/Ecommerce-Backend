import Color from "../model/Color.js";
import asyncHandler from "express-async-handler";



//@desc     create a new Color
//@route    Post /api/v1/Color
//@access   Private/Admin

export const createColorCtrl = asyncHandler(async (req, res) => {
    let { name } = req.body;
    name = name.toLowerCase();
  
    const ColorFound = await Color.findOne({ name });
    if (ColorFound) {
      throw new Error(`Color ${name} already exists`);
    }

    //create
    const color = await Color.create({
      name:name.toLowerCase(),
      user: req.userAuthId,
    });
  
    res.json({
      status: "success",
      message: "Color created successfully",
      color,
    });
  });
  
  //@desc     get all Color
  //@route    GET /api/v1/Color 
  //@access   Public
  
  export const getAllColorCtrl = asyncHandler(async (req, res) => {
    const color = await Color.find({});
    res.json({
      success: true,
      color,
    });
  });
  
  //@desc     get single Color
  //@route    GET /api/v1/Color/:id
  //@access   Public
  
  export const getSingleColorCtrl = asyncHandler(async (req, res) => {
    const color = await Color.findById(req.params.id);
    if (!color) throw new Error(`Cannot find brand`);
  
    res.json({
      success: true,
      color,
    });
  });
  
  //@desc     udpate Color
  //@route    PUT /api/v1/Color/:id
  //@access   Private/admin
  
  export const updateColorCtrl = asyncHandler(async (req, res) => {
    const { name } = req.body;
  
    const color = await Color.findByIdAndUpdate(req.params.id, { name }, {new: true,});
   
    res.json({
      status:"success",
      message:"brand updated successfully",
      color,
    })
  });
  
  
  //@desc     delete Color
  //@route    delete /api/v1/Color/:id
  //@access   Private/admin
  
  export const deleteColorCtrl = asyncHandler(async (req, res) => {
      await Color.findByIdAndDelete(req.params.id);
      res.json({
          status:"Success",
          message:"color deleted successfully"
      })
    });