import ApiReponse from "../dto/response/api.response.js";
import PenaltyTicketService from "../services/penaltyTicket.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    try {
        const penaltyTicketservice = new PenaltyTicketService();
        const result = penaltyTicketservice.create(req.body);
        return res.status(200).json(
            new ApiReponse("succes", "Create a penalty ticket success", result)
        );
    } catch (error) {
        return next(error)
    }

}

export const update = async (req, res, next) => {
    try {
        const penaltyTicketservice = new PenaltyTicketService();
        const result = penaltyTicketservice.update({ id: req.params.id, ...req.body });
        return res.status(200).json(
            new ApiReponse("succes", "Update a penalty ticket success", result)
        );
    } catch (error) {
        return next(error)
    }

}

export const findAll = async (req, res, next) => {
    try {
        const penaltyTicketservice = new PenaltyTicketService();
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const paymentStatus = req.query.paymentStatus;
        const id = req.query.id;
        const penaltyTickets = await penaltyTicketservice.findPagination({ page: page, limit: limit, paymentStatus: paymentStatus, id: id });
        return res.status(200).json(
            new ApiReponse("succes", "Find all penalty ticket success", penaltyTickets)
        );
    } catch (error) {
        return next(error)
    }

}

export const findById = async (req, res, next) => {
    try {
        const penaltyTicketservice = new PenaltyTicketService();
        const result = await penaltyTicketservice.findById(req.params.id);
        return res.status(200).json(
            new ApiReponse("succes", "Find a penalty ticket by id success", result)
        );
    } catch (error) {
        return next(error)
    }

}


export const deletePenaltyTicket = async (req, res, next) => {
    try {
        const penaltyTicketservice = new PenaltyTicketService();
        const document = await penaltyTicketservice.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Penalty ticket not found"));
        }
        return res.send({ message: "Penalty ticket was deleted successfully" });
    } catch (error) {
        return next(error);
    }
}