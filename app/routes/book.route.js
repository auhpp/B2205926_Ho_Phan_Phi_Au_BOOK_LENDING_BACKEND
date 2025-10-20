import express from "express";
import * as bookController from "./../controllers/book.controller.js"

const router = express.Router();

router.post("/", bookController.create)

export default router;