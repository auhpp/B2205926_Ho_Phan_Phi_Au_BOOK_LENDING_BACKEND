import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class BookRepository {
    constructor(client) {
        this.Book = client.db().collection("SACH");
    }

    extractData(payload) {
        const book = {
            name: payload.name,
            price: payload.price,
            authors: payload.authors,
            images: payload.images,
            categories: payload.categories,
            publisher: payload.publisher
        };

        Object.keys(book).forEach(
            key => book[key] == undefined && delete book[key]
        );
        return book;
    }

    async create(payload) {
        const book = this.extractData(payload);
        var _id = payload.id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
        };
        const update = {
            $set: book
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Book.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async delete(id) {
        const filter = {
            _id: id ? new ObjectId(id) : new ObjectId()
        };
        const result = await this.Book.findOneAndDelete(filter);
        return result;
    }

    async findAll({ authorId, publisherId, categoryId, page = 1, limit = 10, name }) {
        const skip = (page - 1) * limit;
        const filterQuery = {};
        if (name) {
            filterQuery.name = { $regex: name, $options: 'i' };
        }
        if (authorId) {
            if (!ObjectId.isValid(authorId)) { return []; }
            filterQuery['authors._id'] = new ObjectId(authorId);
        }
        if (publisherId) {
            if (!ObjectId.isValid(publisherId)) { return []; }
            filterQuery['publisher._id'] = new ObjectId(publisherId);
        }
        if (categoryId) {
            if (!ObjectId.isValid(categoryId)) { return []; }
            filterQuery['categories._id'] = new ObjectId(categoryId);
        }

        const totalItems = await this.Book.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalItems / limit);

        const pipeline = [
            {
                $match: filterQuery
            },
            {
                $lookup: {
                    from: "BAN_SAO_SACH",
                    localField: "_id",
                    foreignField: "bookId",
                    as: "copies"
                }
            },
            {
                $addFields: {
                    bookCopyCount: { $size: "$copies" }
                }
            },
            {
                $unset: "copies"
            },
            { $skip: skip },
            { $limit: limit }
        ];
        const result = await this.Book.aggregate(pipeline).toArray();
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }

    async findById(id) {
        const book = this.Book.findOne({
            _id: id ? new ObjectId(id) : new ObjectId()
        });
        return book;
    }
}

export default BookRepository;