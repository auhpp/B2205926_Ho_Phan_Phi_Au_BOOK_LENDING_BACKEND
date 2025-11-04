import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class ConfigurationRepository {
    constructor(client) {
        this.Configuration = client.db().collection("CAU_HINH");
    }

    extractData(payload) {
        const configuration = {
            value: payload.value,
            unit: payload.unit,

        };

        Object.keys(configuration).forEach(
            key => configuration[key] == undefined && delete configuration[key]
        );
        return configuration;
    }

    async create(payload) {
        const configuration = this.extractData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };

        const update = {
            $set: configuration
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Configuration.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async findAll() {
        const result = await this.Configuration.find({}).toArray();
        return result;
    }

    async findById(id) {
        const configuration = this.Configuration.findOne({
            _id: id ? (ObjectId.isValid(id) ? new ObjectId(id) : null) : new ObjectId()
        });
        return configuration;
    }
    
    async findByName(name) {
        const configuration = this.Configuration.findOne({
            name: name
        });
        return configuration;
    }


    async findPagination({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const totalItems = await this.Configuration.countDocuments({});
        const result = await this.Configuration.find({}).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }
}

export default ConfigurationRepository;