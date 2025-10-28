import express from "express";
import * as bookCopyController from "./../controllers/bookCopy.controller.js"

const router = express.Router();

router.route("/")
    .post(bookCopyController.create)
    .get(bookCopyController.findByBookId)
    
router.route("/:id")
    .delete(bookCopyController.deleteBookCopy)
export default router;