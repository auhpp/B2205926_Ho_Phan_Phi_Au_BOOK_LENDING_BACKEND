import express from "express";
import * as publisherController from "./../controllers/publisher.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(publisherController.create)
    .get(publisherController.findAll);

router.route("/:id")
    .delete(publisherController.deletePublisher);
export default router;