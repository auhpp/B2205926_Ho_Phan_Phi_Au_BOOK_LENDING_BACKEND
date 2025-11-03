import express from "express";
import * as authenticationController from "./../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/admin/signin", authenticationController.authenticateAdmin)
router.post("/signin", authenticationController.authenticateUser)

router.use(authMiddleware);
router.get("/user", authenticationController.getCurrentUser)
export default router;