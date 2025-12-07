import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";
import { generateCode } from "../utils/code.util.js";

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
        var _id = payload.id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
        };

        const update = {
            $set: penaltyTicket,
            $setOnInsert: {
                code: generateCode("PP"),
            }
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

    async findPagination({ page = 1, limit = 10, paymentStatus, id, readerId }) {
        const skip = (page - 1) * limit;
        const matchQuery = {};
        console.log("code", id)
        if (id) {
            matchQuery.code = id;
        }
        if (paymentStatus) {
            matchQuery.paymentStatus = paymentStatus;
        }
        const matchStage = [];
        if (Object.keys(matchQuery).length > 0) {
            matchStage.push({ $match: matchQuery });
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
            ...(readerId ? [{
                $match: {
                    'reader._id': new ObjectId(readerId)
                }
            }] : []),
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    paymentStatus: 1,
                    typePenalty: 1,
                    createdAt: 1,
                    updatedDate: 1,
                    code: 1,
                    loanSlipId: '$loanDetail.loanSlipId',
                    loanSlipCode: '$loanSlip.loanCode',

                    staff: {
                        _id: '$staff._id',
                        fullName: '$staff.fullName',
                        userName: '$staff.userName',
                    },

                    reader: {
                        _id: '$reader._id',
                        fullName: '$reader.fullName',
                        userName: '$reader.userName',
                        phoneNumber: '$reader.phoneNumber',

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
                $sort: { createdAt: -1 }
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
                    code: 1,
                    loanSlipId: '$loanDetail.loanSlipId',
                    loanSlipCode: '$loanSlip.loanCode',

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
                        images: '$book.images',
                        code: '$book.code',
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
            _id: new ObjectId(id)
        };
        const result = await this.PenaltyTicket.findOneAndDelete(filter);
        return result;
    }

    async getStats(readerId) {
        const matchStage = {};

        if (readerId) {
            matchStage['loanSlip.readerId'] = new ObjectId(readerId);
        }

        const pipeline = [
            {
                $lookup: {
                    from: 'THEO_DOI_MUON_SACH',
                    localField: 'loanDetailId',
                    foreignField: '_id',
                    as: 'loanDetail'
                }
            },
            { $unwind: '$loanDetail' },

            {
                $lookup: {
                    from: 'PHIEU_MUON',
                    localField: 'loanDetail.loanSlipId',
                    foreignField: '_id',
                    as: 'loanSlip'
                }
            },
            { $unwind: '$loanSlip' },

            { $match: matchStage },

            {
                $group: {
                    _id: null,

                    totalCount: { $sum: 1 },

                    unpaidCount: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "NOT_PAID"] }, 1, 0]
                        }
                    },

                    totalUnpaidAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$paymentStatus", "NOT_PAID"] }, "$amount", 0]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalCount: 1,
                    unpaidCount: 1,
                    totalUnpaidAmount: 1
                }
            }
        ];

        const result = await this.PenaltyTicket.aggregate(pipeline).toArray();

        if (result.length === 0) {
            return {
                totalCount: 0,
                unpaidCount: 0,
                totalUnpaidAmount: 0
            };
        }

        return result[0];
    }

    async findUnpaidByReaderId(readerId) {
        if (!ObjectId.isValid(readerId)) {
            return [];
        }

        const _readerId = new ObjectId(readerId);

        const pipeline = [

            {
                $match: {
                    paymentStatus: { $ne: "PAID" }
                }
            },

            {
                $lookup: {
                    from: "THEO_DOI_MUON_SACH",
                    localField: "loanDetailId",
                    foreignField: "_id",
                    as: "loanDetail"
                }
            },
            { $unwind: "$loanDetail" },

            {
                $lookup: {
                    from: "PHIEU_MUON",
                    localField: "loanDetail.loanSlipId",
                    foreignField: "_id",
                    as: "loanSlip"
                }
            },
            { $unwind: "$loanSlip" },

            {
                $match: {
                    "loanSlip.readerId": _readerId
                }
            },

            {
                $project: {
                    _id: 1,
                    amount: 1,
                    typePenalty: 1,
                    createdAt: 1,
                    loanSlipCode: "$loanSlip.loanCode",
                    loanSlipId: "$loanSlip._id"
                }
            }
        ];


        return await this.PenaltyTicket.aggregate(pipeline).toArray();
    }
}

export default PenaltyTicketRepository;