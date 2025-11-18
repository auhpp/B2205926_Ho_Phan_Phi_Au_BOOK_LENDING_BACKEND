import express from "express";
import * as loanDetailController from "./../controllers/loanDetail.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { updateLoanDetailSchema } from "../validations/loanDetail.validation.js";
import { idSchema } from "../validations/commom.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/:id")
    .put(validate(idSchema, "params"), validate(updateLoanDetailSchema, "body"), loanDetailController.update)

export default router;