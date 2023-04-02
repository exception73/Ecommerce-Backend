import express from 'express';

import { createCategoryCtrl, deleteCategoryCtrl, getAllCategoriesCtrl, getSingleCategoriesCtrl, updateCategoryCtrl } from '../controllers/categoresCtrl.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import categoryFileUpload from '../config/categoryUpload.js';

const categoryRouter = express.Router();

categoryRouter.post("/", isLoggedIn, categoryFileUpload.single("file") , createCategoryCtrl);
categoryRouter.get("/", isLoggedIn, getAllCategoriesCtrl);
categoryRouter.get("/:id", isLoggedIn, getSingleCategoriesCtrl);
categoryRouter.delete("/:id", isLoggedIn, deleteCategoryCtrl);
categoryRouter.put("/:id", isLoggedIn, updateCategoryCtrl);

export default categoryRouter;