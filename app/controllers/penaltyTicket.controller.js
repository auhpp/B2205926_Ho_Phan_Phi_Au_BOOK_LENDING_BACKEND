import ApiReponse from "../dto/response/api.response.js";
import PenaltyTicketService from "../services/penaltyTicket.service.js";
import ApiError from "../api-error.js";
import { Role } from "../enums/role.enum.js"

export const create = async (req, res, next) => {
    try {
        const penaltyTicketservice = new PenaltyTicketService();
        const result = penaltyTicketservice.create(req.body);
        return res.status(200).json(
            new ApiReponse("success", "Create a penalty ticket success", result)
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
            new ApiReponse("success", "Update a penalty ticket success", result)
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
        const currentUser = req.user
        const readerId = currentUser.role == Role.ADMIN ? null : currentUser.id
        const keyword = req.query.keyword;
        const isPhoneNumber = /^[0-9]+$/.test(keyword) && keyword.startsWith('0');
        var readerPhoneNumber;
        var id;
        if (isPhoneNumber) {
            readerPhoneNumber = keyword
        } else {
            id = keyword
        }
        const penaltyTickets = await penaltyTicketservice.findPagination({
            page: page, limit: limit,
            paymentStatus: paymentStatus, id: id,
            readerId: readerId,
            readerPhoneNumber: readerPhoneNumber
        });
        return res.status(200).json(
            new ApiReponse("success", "Find all penalty ticket success", penaltyTickets)
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
            new ApiReponse("success", "Find a penalty ticket by id success", result)
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


export const getStats = async (req, res, next) => {
    try {
        const penaltyTicketservice = new PenaltyTicketService();
        const currentUser = req.user;

        const readerId = currentUser.role === Role.ADMIN ? req.query.readerId : currentUser.id;

        const stats = await penaltyTicketservice.getStats(readerId);

        return res.status(200).json(
            new ApiReponse("success", "Get penalty statistics success", stats)
        );
    } catch (error) {
        return next(error);
    }
}