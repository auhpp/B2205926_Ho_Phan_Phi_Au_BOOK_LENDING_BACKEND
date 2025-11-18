import express from "express";
import * as bookController from "./../controllers/book.controller.js"
import uploadParser from "../middlewares/formParser.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createBookSchema, findAllSchema, updateBookSchema } from "../validations/book.validation.js";
import { idSchema } from "../validations/commom.validation.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/")
    .post(
        uploadParser.array('productImages', 5),
        validate(createBookSchema, 'body'),
        bookController.create)
    .get(validate(findAllSchema, "query"), bookController.findAll)

router.route("/:id")
    .delete(validate(idSchema, "params"), bookController.deleteBook)
    .get(validate(idSchema, "params"), bookController.findById)
    .put(
        validate(idSchema, "params"),
        uploadParser.array('productImages', 5),
        validate(updateBookSchema, 'body'),
        bookController.update)

export default router;