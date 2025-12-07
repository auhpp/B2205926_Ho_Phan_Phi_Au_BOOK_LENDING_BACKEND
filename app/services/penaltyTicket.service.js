import ApiError from "../api-error.js";
import PenaltyTicketRepository from "../repositories/penaltyTicket.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import ReaderRepository from "../repositories/reader.repository.js";

class PenaltyTicketService {
    constructor() {
        this.penaltyTicketRepository = new PenaltyTicketRepository(MongoDB.client)
        this.readerRepository = new ReaderRepository(MongoDB.client)
    }

    async create(payload) {
        const result = await this.penaltyTicketRepository.create(payload);
        return result;
    }


    async update(payload) {
        const result = await this.penaltyTicketRepository.create(payload);
        return result;
    }

    async findPagination({ page = 1, limit = 10, paymentStatus, id, readerId, readerPhoneNumber }) {
        var readerIdParam = readerId
        if (readerPhoneNumber) {
            const reader = await this.readerRepository.findByPhoneNumber(readerPhoneNumber)
            if (reader) {
                readerIdParam = reader._id;
            }
            else {
                return []
            }
        }
        const penaltyTickets = await this.penaltyTicketRepository.findPagination({
            page: page, limit: limit,
            paymentStatus: paymentStatus, id: id,
            readerId: readerIdParam
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

    async getStats(readerId) {
        const stats = await this.penaltyTicketRepository.getStats(readerId);
        return stats;
    }

}

export default PenaltyTicketService;