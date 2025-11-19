import express from "express";
import * as authenticationController from "./../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticateSchema } from "../validations/authenticate.validation.js";

const router = express.Router();

router.post("/admin/signin", validate(authenticateSchema, "body"), authenticationController.authenticateAdmin)
router.post("/signin", validate(authenticateSchema, "body"), authenticationController.authenticateUser)

router.use(authMiddleware);
router.get("/user", authenticationController.getCurrentUser)
export default router;