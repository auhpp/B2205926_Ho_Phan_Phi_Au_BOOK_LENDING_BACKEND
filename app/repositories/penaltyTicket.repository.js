import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class PenaltyTicketRepository {
    constructor(client) {
        this.PenaltyTicket = client.db().collection("PHIEU_PHAT");
    }

    
}

export default PenaltyTicketRepository;