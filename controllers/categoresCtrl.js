import Category from "../model/Category.js";
import asyncHandler from "express-async-handler";

//@desc     create a new category
//@route    Post /api/v1/categories
//@access   Private/Admin

export const createCategoryCtrl = asyncHandler(async (req, res) => {
  let { name } = req.body;
  name = name.toLowerCase();
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error(`Category ${name} already exists`);
  }

  //create
  const category = await Category.create({
    name:name.toLowerCase(),
    user: req.userAuthId,
    image: req.file.path,
  });

  res.json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});

//@desc     get all category
//@route    GET /api/v1/categories
//@access   Public

export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json({
    success: true,
    categories,
  });
});

//@desc     get single category
//@route    GET /api/v1/categories/:id
//@access   Public

export const getSingleCategoriesCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new Error(`Cannot find category`);

  res.json({
    success: true,
    category,
  });
});

//@desc     udpate category
//@route    PUT /api/v1/categories/:id
//@access   Private/admin

export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(req.params.id, { name }, {new: true,});

  if(!category){
    throw new Error("category not found")
  }
 
  res.json({
    status:"success",
    message:"category updated successfully",
    category,
  })
});


//@desc     delete category
//@route    delete /api/v1/categories/:id
//@access   Private/admin

export const deleteCategoryCtrl = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);
  if(!category){
    throw new Error(`Category not found`);
  }

    await Category.findByIdAndDelete(req.params.id);
    res.json({
        status:"Success",
        message:"Category deleted successfully"
    })
  });