import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class LoanSlipRepository {
    constructor(client) {
        this.LoanSlip = client.db().collection("PHIEU_MUON");
    }

    extractData(payload) {
        const loanSlip = {
            borrowedDate: payload.borrowedDate,
            returnDate: payload.returnDate,
            returnedDate: payload.returnedDate,
            status: payload.status,
            readerId: payload.readerId ? new ObjectId(payload.readerId) : undefined,
            staffId: payload.staffId ? new ObjectId(payload.staffId) : undefined,
            updatedDate: new Date()
        };

        Object.keys(loanSlip).forEach(
            key => loanSlip[key] == undefined && delete loanSlip[key]
        );
        return loanSlip;
    }


    async create(payload) {
        const loanSlip = this.extractData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
        };

        const update = {
            $set: loanSlip
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.LoanSlip.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async findByStatus(readerId, status) {
        const filter = {
            readerId: readerId ? new ObjectId(readerId) : new ObjectId(),
            status: status
        };
        const loanSlip = this.LoanSlip.findOne(filter);
        return loanSlip;
    }

    async findReaderPenaltyTicket(readerId, status) {
        readerId = readerId ? new ObjectId(readerId) : new ObjectId();
        const innerMatchConditions = {
            '$expr': {
                '$and': [
                    { '$eq': ['$loanDetailId', '$$loanDetailOrigin'] },
                    { '$eq': ['$status', status] }
                ]
            }
        };


        const pipeline = [
            {
                '$match': {
                    'readerId': readerId
                }
            },
            {
                '$lookup': {
                    'from': "THEO_DOI_MUON_SACH",
                    'localField': '_id',
                    'foreignField': 'loanSlipId',
                    'pipeline': [
                        {
                            '$lookup': {
                                'from': "PHIEU_PHAT",
                                'let': { 'loanDetailIdOrigin': '$_id' },
                                'as': 'penaltyTickets',
                                'pipeline': [
                                    {
                                        '$match': innerMatchConditions
                                    }
                                ],
                                'as': 'penaltyTickets'
                            }
                        },
                    ],
                    'as': 'loanDetails',
                }
            },
        ]
        const results = await this.LoanSlip.aggregate(pipeline).toArray();
        return results;
    }

    async countBookByReaderId(readerId, status) {
        const pipeline = [
            {
                '$match': {
                    'readerId': readerId
                }
            },
            {
                '$lookup': {
                    'from': "THEO_DOI_MUON_SACH",
                    'let': { 'loanSlipIdOrigin': '$_id' },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$and': [
                                        { '$eq': ['$loanSlipId', '$$loanSlipIdOrigin'] },
                                        { '$eq': ['$stauts', status] }
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'loanDetails'
                }
            }
        ]
        const results = await this.LoanSlip.aggregate(pipeline).toArray();
        return results;
    }

    async findAll({ page = 1, limit = 10, status, id }) {
        const skip = (page - 1) * limit;

        const matchQuery = {};
        if (id) {
            matchQuery._id = new ObjectId(id);
        }
        if (status) {
            matchQuery.status = status;
        }
        const matchStage = [];
        if (Object.keys(matchQuery).length > 0) {
            matchStage.push({ $match: matchQuery });
        }
        const mainLogicPipeline = [
            {
                $lookup: {
                    from: "THEO_DOI_MUON_SACH",
                    localField: "_id",
                    foreignField: "loanSlipId",
                    as: "loanDetails"
                }
            },
            { $unwind: { path: "$loanDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "BAN_SAO_SACH",
                    localField: "loanDetails.bookCopyId",
                    foreignField: "_id",
                    as: "bookCopyInfo"
                }
            },
            { $unwind: { path: "$bookCopyInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "SACH",
                    localField: "bookCopyInfo.bookId",
                    foreignField: "_id",
                    as: "bookData"
                }
            },
            { $unwind: { path: "$bookData", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    borrowedDate: { $first: "$borrowedDate" },
                    readerId: { $first: "$readerId" },
                    returnDate: { $first: "$returnDate" },
                    returnedDate: { $first: "$returnedDate" },
                    updatedDate: { $first: "$updatedDate" },
                    staffId: { $first: "$staffId" },
                    status: { $first: "$status" },
                    bookCopies: {
                        $push: {
                            $cond: [
                                { $ifNull: ["$bookCopyInfo._id", false] },
                                {
                                    $mergeObjects: [
                                        "$bookCopyInfo",
                                        { "bookData": "$bookData" },
                                        { "loanDetailId": "$loanDetails._id" },
                                        { "loanDetailStatus": "$loanDetails.status" }
                                    ]
                                },
                                "$$REMOVE"
                            ]
                        }
                    }
                }
            },
            {
                $sort: { borrowedDate: -1 }
            },
            {
                $lookup: {
                    from: "DOC_GIA",
                    localField: "readerId",
                    foreignField: "_id",
                    as: "reader"
                }
            },
            {
                $unwind: {
                    path: "$reader",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unset: [
                    "reader.password",
                    "reader.active",
                    "readerId"
                ]
            }
        ];

        const finalPipeline = [
            ...matchStage,
            ...mainLogicPipeline,
            {
                $facet: {
                    data: [
                        { $skip: skip },
                        { $limit: limit }
                    ],
                    metadata: [
                        { $count: "totalItems" }
                    ]
                }
            }
        ];

        const result = await this.LoanSlip.aggregate(finalPipeline).toArray();

        const data = result[0]?.data || [];
        const totalItems = result[0]?.metadata[0]?.totalItems || 0;

        const totalPages = Math.ceil(totalItems / limit);

        return new PageResponse(
            data,
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
                    from: "THEO_DOI_MUON_SACH",
                    localField: "_id",
                    foreignField: "loanSlipId",
                    as: "loanDetails"
                }
            },
            { $unwind: { path: "$loanDetails", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "BAN_SAO_SACH",
                    localField: "loanDetails.bookCopyId",
                    foreignField: "_id",
                    as: "bookCopyInfo"
                }
            },
            { $unwind: { path: "$bookCopyInfo", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "SACH",
                    localField: "bookCopyInfo.bookId",
                    foreignField: "_id",
                    as: "bookData"
                }
            },
            { $unwind: { path: "$bookData", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "PHIEU_PHAT",
                    localField: "loanDetails._id",
                    foreignField: "loanDetailId",
                    as: "penaltyTicket"
                }
            },
            {
                $unwind: {
                    path: "$penaltyTicket",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $group: {
                    _id: "$_id",
                    borrowedDate: { $first: "$borrowedDate" },
                    readerId: { $first: "$readerId" },
                    returnDate: { $first: "$returnDate" },
                    returnedDate: { $first: "$returnedDate" },
                    updatedDate: { $first: "$updatedDate" },
                    staffId: { $first: "$staffId" },
                    status: { $first: "$status" },
                    bookCopies: {
                        $push: {
                            $cond: [
                                { $ifNull: ["$bookCopyInfo._id", false] },
                                {
                                    $mergeObjects: [
                                        "$bookCopyInfo",
                                        { "bookData": "$bookData" },
                                        { "loanDetailId": "$loanDetails._id" },
                                        { "loanDetailStatus": "$loanDetails.status" },
                                        { "penaltyTicket": "$penaltyTicket" }
                                    ]
                                },
                                "$$REMOVE"
                            ]
                        }
                    }
                }
            },
            {
                $sort: { borrowedDate: -1 }
            },
            {
                $lookup: {
                    from: "DOC_GIA",
                    localField: "readerId",
                    foreignField: "_id",
                    as: "reader"
                }
            },
            {
                $unwind: {
                    path: "$reader",
                    preserveNullAndEmptyArrays: true
                }
            },

            {
                $unset: [
                    "reader.password",
                    "reader.active",
                    "readerId"
                ]
            }
        ];

        const aggregationPipeline = [

            {
                $match: { _id: objectId }
            },
            ...mainLogicPipeline
        ];

        const results = await this.LoanSlip.aggregate(aggregationPipeline).toArray();

        if (results.length > 0) {
            return results[0];
        } else {
            return null;
        }
    }
}

export default LoanSlipRepository;