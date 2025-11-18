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
            _id: _id ? new ObjectId(_id) : new ObjectId()
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
            _id: new ObjectId(id)
        });
        return category;
    }

    async findAll() {
        const categories = await this.Category.find({}).toArray();
        return categories;
    }
    async delete(id) {
        const filter = {
            _id: new ObjectId(id)
        };
        const result = await this.Category.findOneAndDelete(filter);
        return result;
    }

    async findPagination({ page = 1, limit = 10, name }) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        const totalItems = await this.Category.countDocuments(filter);
        const result = await this.Category.find(filter).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }
}

export default CategoryRepository;