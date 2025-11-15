import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class LoanDetailRepository {
    constructor(client) {
        this.LoanDetail = client.db().collection("THEO_DOI_MUON_SACH");
    }

    extractData(payload) {
        const LoanDetail = {
            bookCopyId: payload.bookCopyId ? new ObjectId(payload.bookCopyId) : undefined,
            loanSlipId: payload.loanSlipId ? new ObjectId(payload.loanSlipId) : undefined,
            status: payload.status
        };

        Object.keys(LoanDetail).forEach(
            key => LoanDetail[key] == undefined && delete LoanDetail[key]
        );
        return LoanDetail;
    }

    async create(payload) {
        const loanDetail = this.extractData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };

        const update = {
            $set: loanDetail
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.LoanDetail.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async updateManyByLoanSlipId({ loanSlipId, status }) {
        const filter = {
            loanSlipId: loanSlipId ? (ObjectId.isValid(loanSlipId) ? new ObjectId(loanSlipId) : null) : new ObjectId()
        };

        const updateDoc = {
            $set: { "status": status }
        }
        const result = await this.LoanDetail.updateMany(filter, updateDoc)
        return result;
    }

    async findAllByLoanSlipId({ loanSlipId }) {
        const filter = {
            loanSlipId: loanSlipId ? (ObjectId.isValid(loanSlipId) ? new ObjectId(loanSlipId) : null) : new ObjectId()
        };
        const result = await this.LoanDetail.find(filter).toArray();
        return result;
    }
}

export default LoanDetailRepository;