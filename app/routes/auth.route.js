import express from "express";
import * as authenticationController from "./../controllers/auth.controller.js";

const router = express.Router();

router.post("/admin/signin", authenticationController.authenticateAdmin)

export default router;