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
            bookId: payload.bookId ? new ObjectId(payload.bookId) : undefined
        };

        Object.keys(bookCopy).forEach(
            key => bookCopy[key] == undefined && delete bookCopy[key]
        );
        return bookCopy;
    }

    async create(payload) {
        console.log(payload)
        const bookCopy = this.extractData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
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
            _id: new ObjectId(id)
        };
        const result = await this.BookCopy.findOneAndDelete(filter);
        return result;
    }

    async deleteMany(bookId) {
        const filter = {
            bookId: new ObjectId(bookId)
        };
        const result = await this.BookCopy.deleteMany(filter);
        return result;
    }

    async findAll({ bookId, status, page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;

        const filter = {
            bookId: new ObjectId(bookId),
        };
        if (status) {
            filter.status = status;
        }
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

    async countByBookId(bookId, status) {
        const filter = {
            bookId: new ObjectId(bookId),
        };
        if (status) {
            filter.status = status;
        }
        const totalItems = await this.BookCopy.countDocuments(filter);
        return totalItems;
    }

    async findById(id) {
        const book = this.BookCopy.findOne({
            _id: new ObjectId(id)
        });
        return book;
    }


}

export default BookCopyRepository;