import express from "express";
import * as bookController from "./../controllers/book.controller.js"
import uploadParser from "../middlewares/formParser.middleware.js";

const router = express.Router();

router.route("/")
    .post(
        uploadParser.array('productImages', 5),
        bookController.create)

export default router;