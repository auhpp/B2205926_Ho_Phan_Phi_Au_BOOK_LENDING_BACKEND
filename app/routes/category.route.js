import express from "express";
import * as categoryController from "./../controllers/category.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import { createCategorySchema, findAllSchema, updateCategorySchema } from "../validations/category.validation.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(authorize('admin'), validate(createCategorySchema, "body"), categoryController.create)
    .get(authorize('admin'), validate(findAllSchema, "query"), categoryController.findPagination);

router.route("/all")
    .get(authorize('admin'), categoryController.findAll)

router.route("/:id")
    .delete(authorize('admin'), validate(idSchema, "params"), categoryController.deleteCategory)
    .put(authorize('admin'), validate(idSchema, "params"), validate(updateCategorySchema, "body"), categoryController.update)
export default router;