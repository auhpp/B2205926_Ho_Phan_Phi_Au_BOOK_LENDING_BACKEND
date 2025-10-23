import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class CategoryRepository {
    constructor(client) {
        this.Category = client.db().collection("DANH_MUC");
    }

    extractStaffData(payload) {
        const category = {
            name: payload.name,
        };

        Object.keys(category).forEach(
            key => category[key] == undefined && delete category[key]
        );
        return category;
    }

    async create(payload) {
        const category = this.extractStaffData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };

        const update = {
            $set: category
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Category.findOneAndUpdate(
            filter, update, options
        );
        return result;
    }

    async findByName(name) {
        const category = this.Category.findOne({
            name: name
        });
        return category;
    }


    async findById(id) {
        const category = this.Category.findOne({
            _id: id ? (ObjectId.isValid(id) ? new ObjectId(id) : null) : new ObjectId()
        });
        return category;
    }

    async findAll({ page = 1, limit = 10 }) {
        const skip = (page - 1) * limit;
        const totalItems = await this.Category.countDocuments({});
        const categoris = await this.Category.find({}).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            categoris,
            totalItems,
            totalPages,
            page
        );
    }
    async delete(id) {
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        };
        const result = await this.Category.findOneAndDelete(filter);
        return result;
    }
}

export default CategoryRepository;