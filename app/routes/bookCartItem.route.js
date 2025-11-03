import express from "express";
import * as bookCartItemController from "./../controllers/bookCartItem.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(bookCartItemController.create)
    .get(bookCartItemController.findAll);

router.route("/:id")
    .delete(bookCartItemController.deleteBookCartItem);
export default router;