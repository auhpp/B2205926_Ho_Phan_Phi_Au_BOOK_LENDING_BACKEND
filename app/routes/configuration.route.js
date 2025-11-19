import express from "express";
import * as configurationController from "./../controllers/configuration.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { findByNameShema, idSchema } from "../validations/commom.validation.js";
import { findAllSchema, updateConfigurationSchema } from "../validations/configuration.validation.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .get(authorize('admin'), validate(findAllSchema, "query"), configurationController.findPagination);

router.route("/:id")
    .put(authorize('admin'), validate(idSchema, "params"), validate(updateConfigurationSchema, "body"), configurationController.update);

router.route("/name/:name")
    .get(validate(findByNameShema, "params"), configurationController.findByName)


export default router;