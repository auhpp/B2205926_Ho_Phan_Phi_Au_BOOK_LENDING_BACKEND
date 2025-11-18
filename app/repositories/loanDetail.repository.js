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
        var _id = payload.id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
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
            loanSlipId: new ObjectId(loanSlipId)
        };

        const updateDoc = {
            $set: { "status": status }
        }
        const result = await this.LoanDetail.updateMany(filter, updateDoc)
        return result;
    }

    async findAllByLoanSlipId({ loanSlipId }) {
        const filter = {
            loanSlipId: new ObjectId(loanSlipId)
        };
        const result = await this.LoanDetail.find(filter).toArray();
        return result;
    }

    async findByBookCopyIdOrBookId({ bookCopyId, bookId }) {
        if (!bookCopyId && !bookId) {
            return [];
        }

        const pipeline = [];
        const joinBook = {
            $lookup: {
                from: "BAN_SAO_SACH",
                localField: "bookCopyId",
                foreignField: "_id",
                as: "bookCopies"
            }
        };

        if (bookCopyId) {
            if (!ObjectId.isValid(bookCopyId)) {
                return [];
            }
            pipeline.push({
                $match: {
                    bookCopyId: new ObjectId(bookCopyId)
                }
            });
            pipeline.push(joinBook);

        } else if (bookId) {
            if (!ObjectId.isValid(bookId)) {
                return [];
            }
            pipeline.push(joinBook);
            pipeline.push({
                $match: {
                    "bookCopies.bookId": new ObjectId(bookId)
                }
            });
        }

        const result = await this.LoanDetail.aggregate(pipeline).toArray();
        return result;
    }
}

export default LoanDetailRepository;