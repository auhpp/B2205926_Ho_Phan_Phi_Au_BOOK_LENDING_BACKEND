import express from "express";
import * as penaltyTicketController from "./../controllers/penaltyTicket.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import validate from "../middlewares/validate.middleware.js";
import { createPenaltyTicketSchema, findAllSchema } from "../validations/penaltyTicket.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(validate(createPenaltyTicketSchema, "body"), penaltyTicketController.create)
    .get(validate(findAllSchema, "query"), penaltyTicketController.findAll)

router.route("/:id")
    .get(validate(idSchema, "params"), penaltyTicketController.findById)
    .delete(validate(idSchema, "params"), penaltyTicketController.deletePenaltyTicket)
    .put(validate(idSchema, "params"), penaltyTicketController.update)

export default router;