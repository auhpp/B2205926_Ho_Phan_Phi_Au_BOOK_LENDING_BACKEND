import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class BookCartItemRepository {
    constructor(client) {
        this.BookCartItem = client.db().collection("GIO_SACH");
    }

    extractBookCartItemData(payload) {
        const bookCartItem = {
            quantity: payload.quantity,
            bookId: new ObjectId(payload.bookId),
            readerId: new ObjectId(payload.readerId)
        };

        Object.keys(bookCartItem).forEach(
            key => bookCartItem[key] == undefined && delete bookCartItem[key]
        );
        return bookCartItem;
    }

    async create(payload) {
        const bookCartItem = this.extractBookCartItemData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };

        const update = {
            $set: bookCartItem
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.BookCartItem.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async findById(id) {
        const bookCartItem = this.BookCartItem.findOne({
            _id: id ? (ObjectId.isValid(id) ? new ObjectId(id) : null) : new ObjectId()
        });
        return bookCartItem;
    }
    async findByBookIdAndReaderId({ bookId, readerId }) {
        const bookCartItem = this.BookCartItem.findOne({
            bookId: new ObjectId(bookId), readerId: new ObjectId(readerId)
        });
        return bookCartItem;
    }

    async findAll() {
        const categories = await this.BookCartItem.find({}).toArray();
        return categories;
    }
    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const result = await this.BookCartItem.findOneAndDelete(filter);
        return result;
    }

    async findPagination({ readerId, page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const totalItems = await this.BookCartItem.countDocuments({});
        const totalPages = Math.ceil(totalItems / limit);
        const pipeline = [
            {
                $match: { readerId: new ObjectId(readerId) }
            },
            {
                $lookup: {
                    from: "SACH",
                    localField: "bookId",
                    foreignField: "_id",
                    as: 'bookDetails'
                }
            },
            {
                $unwind: {
                    path: '$bookDetails'
                }
            },
            {
                $lookup: {
                    from: "BAN_SAO_SACH",
                    let: { book_id: '$bookDetails._id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$bookId', '$$book_id'] },
                                status: 'available'
                            }
                        },
                        {
                            $count: 'count'
                        }
                    ],
                    as: 'copyInfo'
                }
            },
            {
                $addFields: {
                    'book.availableCopies': {
                        $ifNull: [{ $first: '$copyInfo.count' }, 0]
                    }
                }
            },
            { $project: { copyInfo: 0 } },
            { $skip: skip },
            { $limit: limit }
        ];
        console.log(pipeline)

        const result = await this.BookCartItem.aggregate(pipeline).toArray();
        console.log(result);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }


}

export default BookCartItemRepository;