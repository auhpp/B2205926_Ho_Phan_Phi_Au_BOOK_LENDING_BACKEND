import express from "express";
import * as readerController from "./../controllers/reader.controller.js";
import uploadParser from "../middlewares/formParser.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createReaderSchema, updateReaderSchema } from "../validations/reader.validation.js";
import { idSchema } from "../validations/commom.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(validate(createReaderSchema, "body"), readerController.create)

router.route("/:id")
    .put(validate(idSchema, "params"), validate(updateReaderSchema, "body"), uploadParser.single('avatar'), readerController.update)


export default router;