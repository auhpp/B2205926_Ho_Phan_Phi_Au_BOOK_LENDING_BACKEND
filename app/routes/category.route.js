import express from "express";
import * as categoryController from "./../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import { createCategorySchema, findAllSchema, updateCategorySchema } from "../validations/category.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(validate(createCategorySchema, "body"), categoryController.create)
    .get(validate(findAllSchema, "query"), categoryController.findPagination);

router.route("/all")
    .get(categoryController.findAll)

router.route("/:id")
    .delete(validate(idSchema, "params"), categoryController.deleteCategory)
    .put(validate(idSchema, "params"), validate(updateCategorySchema, "body"), categoryController.update)
export default router;