import express from "express";
import * as loanDetailController from "./../controllers/loanDetail.controller.js";

const router = express.Router();

router.route("/")
    .post(loanDetailController.create)

export default router;