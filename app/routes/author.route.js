import express from "express";
import * as authorController from "./../controllers/author.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(authorController.create)
    .get(authorController.findAll)

router.route("/:id")
    .delete(authorController.deleteAuthor);

export default router;