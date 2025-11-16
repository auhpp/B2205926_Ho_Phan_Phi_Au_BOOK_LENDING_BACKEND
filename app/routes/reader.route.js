import express from "express";
import * as readerController from "./../controllers/reader.controller.js";
import uploadParser from "../middlewares/formParser.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(readerController.create)
    .put(uploadParser.single('avatar'), readerController.update)


export default router;