import express from 'express';
import { createCouponCtrl, deleteCouponCtrl, getAllCouponsCtrl, getCouponCtrl, updateCouponCtrl } from '../controllers/couponCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';


const couponRouter = express.Router();

couponRouter.post('/', isLoggedIn,isAdmin, createCouponCtrl)
couponRouter.get('/', isLoggedIn, getAllCouponsCtrl)
couponRouter.get('/:id', isLoggedIn, getCouponCtrl)
couponRouter.put('/update/:id', isLoggedIn,isAdmin, updateCouponCtrl)
couponRouter.delete('/delete/:id', isLoggedIn,isAdmin, deleteCouponCtrl)


export default couponRouter;