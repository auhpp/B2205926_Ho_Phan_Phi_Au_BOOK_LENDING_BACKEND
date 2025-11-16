import express from "express";
import * as bookCopyController from "./../controllers/bookCopy.controller.js"
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(bookCopyController.create)
    .get(bookCopyController.findByBookId)
    
router.route("/:id")
    .delete(bookCopyController.deleteBookCopy)
export default router;