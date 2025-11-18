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
            _id: _id ? new ObjectId(_id) : new ObjectId()
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

    async findAll() {
        const result = await this.Publisher.find({}).toArray();
        return result;
    }
    async delete(id) {
        const filter = {
            _id: new ObjectId(id)
        };
        const result = await this.Publisher.findOneAndDelete(filter);
        return result;
    }

    async findById(id) {
        const publisher = this.Publisher.findOne({
            _id: new ObjectId(id)
        });
        return publisher;
    }

    async findPagination({ page = 1, limit = 10, name }) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        const totalItems = await this.Publisher.countDocuments(filter);
        const result = await this.Publisher.find(filter).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }

    async findByName(name) {
        const publisher = this.Publisher.findOne({
            name: name
        });
        return publisher;
    }

}

export default PublisherRepository;