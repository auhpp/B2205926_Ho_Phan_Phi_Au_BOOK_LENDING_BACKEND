import express from "express";
import * as staffController from "./../controllers/staff.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.post("/", staffController.create)

export default router;