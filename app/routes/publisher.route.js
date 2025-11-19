import express from "express";
import * as publisherController from "./../controllers/publisher.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import validate from "../middlewares/validate.middleware.js";
import { createPublisherSchema, findAllSchema, updatePublisherSchema } from "../validations/publisher.validation.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(authorize('admin'), validate(createPublisherSchema, "body"), publisherController.create)
    .get(authorize('admin'), validate(findAllSchema, "query"), publisherController.findPagination);

router.route("/all")
    .get(authorize('admin'), publisherController.findAll)

router.route("/:id")
    .delete(authorize('admin'), validate(idSchema, "params"), publisherController.deletePublisher)
    .put(authorize('admin'), validate(updatePublisherSchema, "body"), publisherController.update)

export default router;