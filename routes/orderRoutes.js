import express from 'express';
import { createOrderCtrl, getAllordersCtrl, getSalesSumCtrl, getSingleOrderCtrl, updateOrderCtrl } from '../controllers/orderCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const orderRouter = express.Router();

orderRouter.post('/', isLoggedIn, createOrderCtrl)
orderRouter.get("/",isLoggedIn,getAllordersCtrl);
orderRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
orderRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
orderRouter.get("/sales/sum", isLoggedIn, getSalesSumCtrl);



export default orderRouter;