import express from "express";
import * as bookCopyController from "./../controllers/bookCopy.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import { createBookCopySchema, findByBookIdSchema } from "../validations/bookCopy.validation.js";
import { updateBookSchema } from "../validations/book.validation.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(authorize('admin'), validate(createBookCopySchema, "body"), bookCopyController.create)
    .get(authorize('admin'), validate(findByBookIdSchema, "query"), bookCopyController.findByBookId)

router.route("/:id")
    .put(authorize('admin'), validate(idSchema, 'params'), validate(updateBookSchema, "body"), bookCopyController.update)
    .delete(authorize('admin'), validate(idSchema, "params"), bookCopyController.deleteBookCopy)
export default router;