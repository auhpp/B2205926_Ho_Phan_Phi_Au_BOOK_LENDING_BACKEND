import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class PenaltyTicketRepository {
    constructor(client) {
        this.PenaltyTicket = client.db().collection("PHIEU_PHAT");
    }


    extractData(payload) {
        const penaltyTicket = {
            paymentStatus: payload.paymentStatus,
            typePenalty: payload.typePenalty,
            amount: payload.amount,
            createdAt: payload.createdAt,
            loanDetailId: payload.loanDetailId ? new ObjectId(payload.loanDetailId) : undefined,
            staffId: payload.staffId ? new ObjectId(payload.staffId) : undefined,
            updatedDate: new Date()
        };

        Object.keys(penaltyTicket).forEach(
            key => penaltyTicket[key] == undefined && delete penaltyTicket[key]
        );
        return penaltyTicket;
    }

    async create(payload) {
        const penaltyTicket = this.extractData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };

        const update = {
            $set: penaltyTicket
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.PenaltyTicket.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async findPagination({ page = 1, limit = 10, paymentStatus }) {
        const skip = (page - 1) * limit;

        const matchStage = [];
        if (paymentStatus) {
            matchStage.push({
                $match: { paymentStatus: paymentStatus }
            });
        }
        const aggregationPipeline = [
            ...matchStage,
            {
                $lookup: {
                    from: 'THEO_DOI_MUON_SACH',
                    localField: 'loanDetailId',
                    foreignField: '_id',
                    as: 'loanDetail'
                }
            },
            { $unwind: { path: '$loanDetail', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'BAN_SAO_SACH',
                    localField: 'loanDetail.bookCopyId',
                    foreignField: '_id',
                    as: 'bookCopy'
                }
            },
            { $unwind: { path: '$bookCopy', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'SACH',
                    localField: 'bookCopy.bookId',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'NHAN_VIEN',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            { $unwind: { path: '$staff', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'PHIEU_MUON',
                    localField: 'loanDetail.loanSlipId',
                    foreignField: '_id',
                    as: 'loanSlip'
                }
            },
            { $unwind: { path: '$loanSlip', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'DOC_GIA',
                    localField: 'loanSlip.readerId',
                    foreignField: '_id',
                    as: 'reader'
                }
            },
            { $unwind: { path: '$reader', preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 1,
                    amount: 1,
                    paymentStatus: 1,
                    typePenalty: 1,
                    createdAt: 1,
                    updatedDate: 1,

                    loanSlipId: '$loanDetail.loanSlipId',

                    staff: {
                        _id: '$staff._id',
                        fullName: '$staff.fullName',
                        userName: '$staff.userName',
                    },

                    reader: {
                        _id: '$reader._id',
                        fullName: '$reader.fullName',
                        userName: '$reader.userName',
                    },

                    bookCopy: {
                        _id: '$bookCopy._id',
                        barCode: '$bookCopy.barCode',
                        status: '$bookCopy.status'
                    },
                    book: {
                        _id: '$book._id',
                        name: '$book.name',
                        price: '$book.price',
                        images: '$book.images'
                    }
                }
            },

            {
                $facet: {
                    metadata: [{ $count: 'totalItems' }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            },

            {
                $project: {
                    result: '$data',
                    totalItems: { $arrayElemAt: ['$metadata.totalItems', 0] }
                }
            }
        ];

        const aggregationResult = await this.PenaltyTicket.aggregate(aggregationPipeline).toArray();

        const data = aggregationResult[0];

        const result = data.result || [];
        const totalItems = data.totalItems || 0;
        const totalPages = Math.ceil(totalItems / limit);

        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }


    async findById(id) {
        if (!ObjectId.isValid(id)) {
            return null;
        }

        const objectId = new ObjectId(id);

        const mainLogicPipeline = [
            {
                $lookup: {
                    from: 'THEO_DOI_MUON_SACH',
                    localField: 'loanDetailId',
                    foreignField: '_id',
                    as: 'loanDetail'
                }
            },
            { $unwind: { path: '$loanDetail', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'BAN_SAO_SACH',
                    localField: 'loanDetail.bookCopyId',
                    foreignField: '_id',
                    as: 'bookCopy'
                }
            },
            { $unwind: { path: '$bookCopy', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'SACH',
                    localField: 'bookCopy.bookId',
                    foreignField: '_id',
                    as: 'book'
                }
            },
            { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'NHAN_VIEN',
                    localField: 'staffId',
                    foreignField: '_id',
                    as: 'staff'
                }
            },
            { $unwind: { path: '$staff', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'PHIEU_MUON',
                    localField: 'loanDetail.loanSlipId',
                    foreignField: '_id',
                    as: 'loanSlip'
                }
            },
            { $unwind: { path: '$loanSlip', preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: 'DOC_GIA',
                    localField: 'loanSlip.readerId',
                    foreignField: '_id',
                    as: 'reader'
                }
            },
            { $unwind: { path: '$reader', preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    _id: 1,
                    amount: 1,
                    paymentStatus: 1,
                    typePenalty: 1,
                    createdAt: 1,
                    updatedDate: 1,

                    loanSlipId: '$loanDetail.loanSlipId',

                    staff: {
                        _id: '$staff._id',
                        fullName: '$staff.fullName',
                        userName: '$staff.userName',
                        avatar: '$staff.avatar',
                        phoneNumber: '$staff.phoneNumber',
                    },

                    reader: {
                        _id: '$reader._id',
                        fullName: '$reader.fullName',
                        userName: '$reader.userName',
                        avatar: '$reader.avatar',
                        phoneNumber: '$reader.phoneNumber',
                        email: '$reader.email',

                    },

                    bookCopy: {
                        _id: '$bookCopy._id',
                        barCode: '$bookCopy.barCode',
                        status: '$bookCopy.status'
                    },
                    book: {
                        _id: '$book._id',
                        name: '$book.name',
                        price: '$book.price',
                        images: '$book.images'
                    }
                }
            },
        ];

        const aggregationPipeline = [

            {
                $match: { _id: objectId }
            },
            ...mainLogicPipeline
        ];

        const results = await this.PenaltyTicket.aggregate(aggregationPipeline).toArray();
        if (results.length > 0) {
            return results[0];
        } else {
            return null;
        }
    }

    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const result = await this.PenaltyTicket.findOneAndDelete(filter);
        return result;
    }
}

export default PenaltyTicketRepository;