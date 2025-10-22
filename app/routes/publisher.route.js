import express from "express";
import * as publisherController from "./../controllers/publisher.controller.js";

const router = express.Router();

router.route("/")
    .post(publisherController.create)
    .get(publisherController.findAll);

router.route("/:id")
    .delete(publisherController.deletePublisher);
export default router;