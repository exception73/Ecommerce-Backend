import express from 'express';

import { createBrandCtrl, deleteBrandCtrl, getAllBrandCtrl, getSingleBrandCtrl, updateBrandCtrl } from '../controllers/brandCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const brandRouter = express.Router();

brandRouter.post("/", isLoggedIn,isAdmin, createBrandCtrl);
brandRouter.get("/",  getAllBrandCtrl);
brandRouter.get("/:id", getSingleBrandCtrl);
brandRouter.delete("/:id", isLoggedIn,isAdmin, deleteBrandCtrl);
brandRouter.put("/:id", isLoggedIn,isAdmin, updateBrandCtrl);

export default brandRouter;