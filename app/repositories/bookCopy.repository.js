import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class BookCopyRepository {
    constructor(client) {
        this.BookCopy = client.db().collection("BAN_SAO_SACH");
    }

    extractData(payload) {
        const bookCopy = {
            status: payload.status,
            barCode: payload.barCode,
            bookId: new ObjectId(payload.bookId)
        };

        Object.keys(bookCopy).forEach(
            key => bookCopy[key] == undefined && delete bookCopy[key]
        );
        return bookCopy;
    }

    async create(payload) {
        const bookCopy = this.extractData(payload);
        var _id = payload.id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };
        const update = {
            $set: bookCopy
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.BookCopy.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const result = await this.BookCopy.findOneAndDelete(filter);
        return result;
    }

    async deleteMany(bookId) {
        const filter = {
            bookId: ObjectId.isValid(bookId) ? new ObjectId(bookId) : null
        };
        const result = await this.BookCopy.deleteMany(filter);
        return result;
    }

    async findAll({ bookId, page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const filter = {
            bookId: ObjectId.isValid(bookId) ? new ObjectId(bookId) : null
        };
        const totalItems = await this.BookCopy.countDocuments(filter);
        const result = await this.BookCopy.find(filter).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }

    async countByBookId(bookId) {
        const totalBookCopy = await this.BookCopy.countDocuments({
            bookId: bookId ? (ObjectId.isValid(bookId) ? new ObjectId(bookId) : null) : new ObjectId()
        });
        return totalBookCopy;
    }

    async findById(id) {
        const book = this.BookCopy.findOne({
            _id: id ? (ObjectId.isValid(id) ? new ObjectId(id) : null) : new ObjectId()
        });
        return book;
    }
}

export default BookCopyRepository;