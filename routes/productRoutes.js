import express from 'express';
import upload from '../config/fileUpload.js';
import { createProductCtrl, deleteProductCtrl, getProductsCtrl, getSingleProductCtrl, updateProductCtrl } from '../controllers/productCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const productRouter = express.Router();


productRouter.post('/',isLoggedIn,isAdmin, upload.array('files'), createProductCtrl);
productRouter.get('/',isLoggedIn, getProductsCtrl);
productRouter.get('/:id',isLoggedIn, getSingleProductCtrl);
productRouter.put('/:id',isLoggedIn,isAdmin,updateProductCtrl);
productRouter.delete('/:id',isLoggedIn,isAdmin,deleteProductCtrl);

export default productRouter;