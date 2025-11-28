import express from "express";
import * as readerController from "./../controllers/reader.controller.js";
import uploadParser from "../middlewares/formParser.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createReaderSchema, findAllSchema, updateReaderSchema } from "../validations/reader.validation.js";
import { idSchema } from "../validations/commom.validation.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();


router.use(authMiddleware);

router.route("/")
    .post(validate(createReaderSchema, "body"), readerController.create)
    .get(authorize("admin"), validate(findAllSchema, "query"), readerController.findPagination);


router.route("/:id")
    .put(authorize('user'), validate(idSchema, "params"),
        uploadParser.single('avatar'),
        validate(updateReaderSchema, "body"),
        readerController.update)

router.route("/admin/:id")
    .put(authorize('admin'), validate(idSchema, "params"),
        validate(updateReaderSchema, "body"),
        readerController.updateStatus)
export default router;