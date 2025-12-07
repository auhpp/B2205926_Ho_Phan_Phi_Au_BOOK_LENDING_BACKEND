import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";
import { generateCode } from "../utils/code.util.js";

class AuthorRepository {
    constructor(client) {
        this.Author = client.db().collection("TAC_GIA");
    }

    extractStaffData(payload) {
        const author = {
            name: payload.name,
        };

        Object.keys(author).forEach(
            key => author[key] == undefined && delete author[key]
        );
        return author;
    }

    async create(payload) {
        const author = this.extractStaffData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
        };

        const update = {
            $set: author,
            $setOnInsert: {
                code: generateCode("TG"),
            }
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Author.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async findAll() {
        const result = await this.Author.find({}).toArray();
        return result;
    }

    async findPagination({ page = 1, limit = 10, name }) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        const totalItems = await this.Author.countDocuments(filter);
        const result = await this.Author.find(filter).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }

    async findById(id) {
        const author = this.Author.findOne({
            _id: new ObjectId(id)
        });
        return author;
    }

    async delete(id) {
        const filter = {
            _id: new ObjectId(id)
        };
        const result = await this.Author.findOneAndDelete(filter);
        return result;
    }

    async findByName(name) {
        const author = this.Author.findOne({
            name: name
        });
        return author;
    }
}

export default AuthorRepository;