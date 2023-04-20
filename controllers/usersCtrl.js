import User from "../model/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToken.js";

// @desc    Register user
// @route   POST /api/v1/users/register
//@access   Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;

  //check if user is already registered
  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new Error("User already registered");
  }

  //hash password
  // const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, 10);

  //create
  const user = await User.create({ email, password: hashedPassword, fullname });
  user.save();
  return res.status(201).json({
    success: true,
    message: "user created successfully",
    data: user,
  });
});

// @desc    Login user
// @route   POST /api/v1/users/login
//@access   Public

export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });

  if (userFound && (await bcrypt.compare(password, userFound.password))) {
    res.status(200).json({
      success: true,
      message: "login successful",
      userFound,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid login credentials", 400);
  }
});

// @desc    get user profile
// @route   POST /api/v1/users/profile
//@access   Private

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userAuthId).populate("orders")
  
  res.json({
    success: true,
    user,
  });
});

//@desc    update user shipping address
//@route   PUT /api/v1/users/update/shipping
//@access  Private

export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, address, city, postalCode, province, phone } =
    req.body;

  const user = await User.findByIdAndUpdate(req.userAuthId, {
    shippingAddress: {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      province,
      phone,
    },
    hasShippingAddress: true,
  },{
    new: true,
  });

  res.json({
    status:"success",
    message:"User shipping address updated successfully",
    user,
  })
});
