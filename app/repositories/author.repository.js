import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

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
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };

        const update = {
            $set: author
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

    async findById(id) {
        const author = this.Author.findOne({
            _id: id ? (ObjectId.isValid(id) ? new ObjectId(id) : null) : new ObjectId()
        });
        return author;
    }

    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const result = await this.Author.findOneAndDelete(filter);
        return result;
    }

}

export default AuthorRepository;