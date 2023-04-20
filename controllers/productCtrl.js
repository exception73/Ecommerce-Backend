import Product from "../model/Product.js";
import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

// @desc  Create new product
//@route  POST /api/v1/products
//@access Private/Admin
export const createProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  const convertedImgs = req.files.map((file) => file?.path);

  //product exisits
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error(`Product ${name} already exists`);
  }

  //find the cateogry  
  const categoryFound = await Category.findOne({name:category.toLowerCase()});
  if(!categoryFound){ throw new Error("category not found, please create a category first or check category name")}

  const brandFound = await Brand.findOne({name:brand.toLowerCase()});
  if(!brandFound){ throw new Error("brand not found, please create a brand first or check brand name")}
  

  //create the product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand:brand.toLowerCase(),
    images:convertedImgs,
  });
  
  //push the product in the category list
  categoryFound.products.push(product._id);
  await categoryFound.save()

  //push the product in the brand list
  brandFound.products.push(product._id);
  await brandFound.save();

  //send response
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

//@desc    get all products
//@route   get /api/v1/products
//@access  public
export const getProductsCtrl = asyncHandler(async (req, res) => { 
  let productQuery = Product.find();

  //filter by name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }

  //filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }

  //filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }

  //filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }

  //filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }

  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greater or equal to
    //lte: less or equal to

    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //pagination

  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  //startIndex
  const startIndex = (page - 1) * limit;

  //endIndex
  const endIndex = page * limit;

  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);

  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
    };
  }

  const products = await productQuery.populate("reviews");

  res.json({
    success: true,
    total,
    results: products.length,
    pagination,
    message: "products fetched successfully",
    products,
  });
});

//@desc    get single products
//@route   get /api/v1/product/:id
//@access  public
export const getSingleProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new Error(`Product ${req.params.id} not found`);
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//@desc    update products
//@route   put /api/v1/product/:id
//@access  Private/Admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    { new: true }
  );

  res.json({
    status:"success",
    message:"Product updated successfully",
    product,
  })

});


//@desc    delete product
//@route   delete /api/v1/product/:id
//@access  Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
   
  const product = await Product.findById(req.params.id);
  if(!product) throw new Error("Product not found");

  Product.deleteOne({product});

    res.json({
      status:"success",
      message:"Product deleted successfully"
    })
  
  });
