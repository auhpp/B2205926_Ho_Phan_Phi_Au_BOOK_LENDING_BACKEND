import express from "express";
import * as configurationController from "./../controllers/configuration.controller.js";

const router = express.Router();

router.route("/")
    .post(configurationController.create)
    .get(configurationController.findAll);

router.route("/:name")
    .get(configurationController.findByName)


export default router;