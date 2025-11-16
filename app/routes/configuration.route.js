import express from "express";
import * as configurationController from "./../controllers/configuration.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(configurationController.create)
    .get(configurationController.findAll);

router.route("/:name")
    .get(configurationController.findByName)


export default router;