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
            yearOfPublication: payload.yearOfPublication,
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
        const book = this.  extractData(payload);
        var _id = payload.id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
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
            _id: id ? (ObjectId.isValid(id) ? new ObjectId(id) : null) : new ObjectId()
        };
        const result = await this.Book.findOneAndDelete(filter);
        console.log("res xoa", result)
        return result;
    }

    async findAll({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const totalItems = await this.Book.countDocuments({});
        const result = await this.Book.find({}).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }

    async findById(id) {
        const book = this.Book.findOne({
            _id: id ? (ObjectId.isValid(id) ? new ObjectId(id) : null) : new ObjectId()
        });
        return book;
    }
}

export default BookRepository;