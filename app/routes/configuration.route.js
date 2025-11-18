import express from "express";
import * as configurationController from "./../controllers/configuration.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { findByNameShema, idSchema } from "../validations/commom.validation.js";
import { findAllSchema, updateConfigurationSchema } from "../validations/configuration.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .get(validate(findAllSchema, "query"), configurationController.findPagination);

router.route("/all")
    .get(configurationController.findAll);

router.route("/:id")
    .put(validate(idSchema, "params"), validate(updateConfigurationSchema, "body"), configurationController.update);

router.route("/name/:name")
    .get(validate(findByNameShema, "params"), configurationController.findByName)


export default router;