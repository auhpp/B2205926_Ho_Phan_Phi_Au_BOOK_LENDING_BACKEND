import express from "express";
import * as bookController from "./../controllers/book.controller.js"
import uploadParser from "../middlewares/formParser.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/")
    .post(
        uploadParser.array('productImages', 5),
        bookController.create)
    .get(bookController.findAll)

router.route("/:id")
    .delete(bookController.deleteBook)
    .get(bookController.findById)

export default router;