import express from 'express';

import { createColorCtrl, deleteColorCtrl, getAllColorCtrl, getSingleColorCtrl, updateColorCtrl } from '../controllers/colorCtrl.js';
import isAdmin from '../middlewares/isAdmin.js';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';

const ColorRouter = express.Router();

ColorRouter.post("/", isLoggedIn,isAdmin, createColorCtrl);
ColorRouter.get("/", getAllColorCtrl);
ColorRouter.get("/:id",  getSingleColorCtrl);
ColorRouter.delete("/:id", isLoggedIn,isAdmin, deleteColorCtrl);
ColorRouter.put("/:id", isLoggedIn,isAdmin, updateColorCtrl);

export default ColorRouter;