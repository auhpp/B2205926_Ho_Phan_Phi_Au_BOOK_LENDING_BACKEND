import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class PublisherRepository {
    constructor(client) {
        this.Publisher = client.db().collection("NHA_XUAT_BAN");
    }

    extractData(payload) {
        const publisher = {
            name: payload.name,
            address: payload.address
        };

        Object.keys(publisher).forEach(
            key => publisher[key] == undefined && delete publisher[key]
        );
        return publisher;
    }

    async create(payload) {
        const publisher = this.extractData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };

        const update = {
            $set: publisher
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Publisher.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async findAll({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const totalItems = await this.Publisher.countDocuments({});
        const result = await this.Publisher.find({}).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }
    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const result = await this.Publisher.findOneAndDelete(filter);
        return result;
    }

    async findById(id) {
        const publisher = this.Publisher.findOne({
            _id: id ? (ObjectId.isValid(id) ? new ObjectId(id) : null) : new ObjectId()
        });
        return publisher;
    }
}

export default PublisherRepository;