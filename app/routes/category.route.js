import express from "express";
import * as categoryController from "./../controllers/category.controller.js";

const router = express.Router();

router.route("/")
    .post(categoryController.create)
    .get(categoryController.findAll);

router.route("/:id")
    .delete(categoryController.deleteCategory);
export default router;