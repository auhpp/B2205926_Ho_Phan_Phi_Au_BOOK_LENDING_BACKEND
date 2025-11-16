import express from "express";
import * as loanSlipController from "./../controllers/loanSlip.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(loanSlipController.create)
    .get(loanSlipController.findAll)

router.route("/:id")
    .get(loanSlipController.findById)
export default router;