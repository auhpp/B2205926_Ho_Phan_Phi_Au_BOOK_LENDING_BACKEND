import express from "express";
import * as bookCopyController from "./../controllers/bookCopy.controller.js"

const router = express.Router();

router.route("/")
    .post(bookCopyController.create)
    .get(bookCopyController.findAll)

export default router;