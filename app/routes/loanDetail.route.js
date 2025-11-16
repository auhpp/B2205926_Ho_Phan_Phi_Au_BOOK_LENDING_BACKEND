import express from "express";
import * as loanDetailController from "./../controllers/loanDetail.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(loanDetailController.create)

export default router;