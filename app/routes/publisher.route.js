import express from "express";
import * as publisherController from "./../controllers/publisher.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import validate from "../middlewares/validate.middleware.js";
import { createPublisherSchema, findAllSchema, updatePublisherSchema } from "../validations/publisher.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(validate(createPublisherSchema, "body"), publisherController.create)
    .get(validate(findAllSchema, "query"), publisherController.findPagination);

router.route("/all")
    .get(publisherController.findAll)

router.route("/:id")
    .delete(validate(idSchema, "params"), publisherController.deletePublisher)
    .put(validate(updatePublisherSchema, "body"), publisherController.update)

export default router;