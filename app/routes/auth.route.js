import express from "express";
import * as authenticationController from "./../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { authenticateSchema, changePasswordSchema, resetPasswordSchema, sendOtpSchema, verifyOtpSchema } from "../validations/authenticate.validation.js";

const router = express.Router();

router.post("/admin/signin", validate(authenticateSchema, "body"), authenticationController.authenticateAdmin)
router.post("/signin", validate(authenticateSchema, "body"), authenticationController.authenticateUser)
router.post("/sendOtp", validate(sendOtpSchema, "body"), authenticationController.sendOtp)
router.post("/verifyOtp", validate(verifyOtpSchema, "body"), authenticationController.verifyOtp)
router.post("/resetPassword", validate(resetPasswordSchema, "body"), authenticationController.resetPassword)

router.use(authMiddleware);
router.get("/user", authenticationController.getCurrentUser)
router.post("/changePassword", validate(changePasswordSchema, "body"), authenticationController.changePassword)

export default router;