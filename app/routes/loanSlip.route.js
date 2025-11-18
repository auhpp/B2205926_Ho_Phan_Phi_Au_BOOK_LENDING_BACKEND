import express from "express";
import * as loanSlipController from "./../controllers/loanSlip.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { idSchema, paginationSchema } from "../validations/commom.validation.js";
import validate from "../middlewares/validate.middleware.js";
import { createLoanSlipSchema, findAllSchema, updateLoanSlipSchema } from "../validations/loanSlip.validation.js";
const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(validate(createLoanSlipSchema, "body"), loanSlipController.create)
    .get(validate(findAllSchema, "query"), loanSlipController.findAll)

router.route("/:id")
    .get(validate(idSchema, "params"), loanSlipController.findById)
    .put(validate(idSchema, "params"), validate(updateLoanSlipSchema, "body"), loanSlipController.update)
export default router;