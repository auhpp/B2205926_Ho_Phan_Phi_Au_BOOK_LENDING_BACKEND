import express from "express";
import * as penaltyTicketController from "./../controllers/penaltyTicket.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(penaltyTicketController.create)
    .get(penaltyTicketController.findAll)

router.route("/:id")
    .get(penaltyTicketController.findById)
    .delete(penaltyTicketController.deletePenaltyTicket);

export default router;