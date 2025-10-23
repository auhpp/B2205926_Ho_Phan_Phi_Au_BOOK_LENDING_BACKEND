import { ObjectId } from "mongodb";

class BookCopyRepository {
    constructor(client) {
        this.BookCopy = client.db().collection("BAN_SAO_SACH");
    }

    extractData(payload) {
        const bookCopy = {
            status: payload.status,
            barCode: payload.barCode,
            bookId: payload.bookId
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

    async findAll({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const totalItems = await this.BookCopy.countDocuments({});
        const result = await this.BookCopy.find({}).skip(skip).limit(limit).toArray();
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
            bookId: bookId
        });
        return totalBookCopy;
    }

}

export default BookCopyRepository;