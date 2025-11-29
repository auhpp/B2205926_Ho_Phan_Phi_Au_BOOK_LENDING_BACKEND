import express from "express";
import * as staffController from "./../controllers/staff.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { createStaffSchema, findAllSchema, updateStaffSchema } from "../validations/staff.validation.js";
import validate from "../middlewares/validate.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import uploadParser from "../middlewares/formParser.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(authorize("admin"), validate(createStaffSchema, "body"), staffController.create)
    .get(authorize("admin"), validate(findAllSchema, "query"), staffController.findPagination);

router.route("/all")
    .get(authorize("admin"), staffController.findAll);

router.route("/:id")
    .put(authorize('admin'), validate(idSchema, "params"),
        uploadParser.single('avatar'),
        validate(updateStaffSchema, "body"),
        staffController.updateInfo)

router.route("/admin/:id")
    .put(authorize('admin'), validate(idSchema, "params"), validate(updateStaffSchema, "body"), staffController.update)
export default router;