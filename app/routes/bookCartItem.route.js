import express from "express";
import * as bookCartItemController from "./../controllers/bookCartItem.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { idSchema, paginationSchema } from "../validations/commom.validation.js";
import { createBookCartItemSchema } from "../validations/bookCartItem.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(validate(createBookCartItemSchema, "body"), bookCartItemController.create)
    .get(validate(paginationSchema, "query"), bookCartItemController.findAll);

router.route("/count")
    .get(bookCartItemController.countDocuments);

router.route("/:id")
    .delete(validate(idSchema, "params"), bookCartItemController.deleteBookCartItem);
export default router;