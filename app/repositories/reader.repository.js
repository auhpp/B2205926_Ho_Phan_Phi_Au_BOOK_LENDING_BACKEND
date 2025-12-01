import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";

class ReaderRepository {
    constructor(client) {
        this.Reader = client.db().collection("DOC_GIA");
    }

    extractReaderData(payload) {
        const reader = {
            userName: payload.userName,
            password: payload.password,
            active: payload.active,
            fullName: payload.fullName,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            gender: payload.gender,
            dateOfBirth: payload.dateOfBirth,
            avatar: payload.avatar
        };

        Object.keys(reader).forEach(
            key => reader[key] == undefined && delete reader[key]
        );
        return reader;
    }

    async findByUserName(userName) {
        return await this.Reader.findOne({
            userName: userName
        });
    }

    async findByPhoneNumber(phoneNumber) {
        return await this.Reader.findOne({
            phoneNumber: phoneNumber
        });
    }

    async create(payload) {
        const reader = this.extractReaderData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
        };

        const update = {
            $set: reader
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Reader.findOneAndUpdate(
            filter, update, options
        );
        return {
            "userName": result.userName,
            "_id": result._id
        };
    }

    async update(payload) {
        const reader = this.extractReaderData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
        };

        const update = {
            $set: reader
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Reader.findOneAndUpdate(
            filter, update, options
        );
        const { password, ...userWithoutPassword } = result;
        return userWithoutPassword;
    }

    async findById(id) {
        const reader = this.Reader.findOne({
            _id: new ObjectId(id)
        });
        return reader;
    }

    async findPagination({ page = 1, limit = 10, userName, active }) {
        const skip = (page - 1) * limit;
        const filter = {};
        if (userName) {
            filter.userName = userName;
        }
        if (active != undefined && active != null) {
            filter.active = (String(active) === 'true');
        }
        const totalItems = await this.Reader.countDocuments(filter);
        const result = await this.Reader.find(filter).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }
}

export default ReaderRepository;