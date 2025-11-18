import ApiError from "../api-error.js";
import PenaltyTicketRepository from "../repositories/penaltyTicket.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class PenaltyTicketService {
    constructor() {
        this.penaltyTicketRepository = new PenaltyTicketRepository(MongoDB.client)
    }

    async create(payload) {
        const result = await this.penaltyTicketRepository.create(payload);
        return result;
    }


    async update(payload) {
        const result = await this.penaltyTicketRepository.create(payload);
        return result;
    }

    async findPagination({ page = 1, limit = 10, paymentStatus, id }) {
        const penaltyTickets = await this.penaltyTicketRepository.findPagination({
            page: page, limit: limit,
            paymentStatus: paymentStatus, id
        });
        return penaltyTickets;
    }

    async findById(id) {
        const penaltyTicket = await this.penaltyTicketRepository.findById(id);
        return penaltyTicket;
    }

    async delete(id) {
        const penaltyTicket = await this.penaltyTicketRepository.delete(id);
        return penaltyTicket;
    }

}

export default PenaltyTicketService;