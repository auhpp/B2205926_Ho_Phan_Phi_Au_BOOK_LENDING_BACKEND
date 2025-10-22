import express from "express";
import * as authorController from "./../controllers/author.controller.js";

const router = express.Router();

router.route("/")
    .post(authorController.create)
    .get(authorController.findAll)

router.route("/:id")
    .delete(authorController.deleteAuthor);

export default router;