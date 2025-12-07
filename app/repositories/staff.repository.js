import { ObjectId } from "mongodb";
import PageResponse from "../dto/response/page.response.js";
import { generateCode } from "../utils/code.util.js";

class StaffRepository {
    constructor(client) {
        this.Staff = client.db().collection("NHAN_VIEN");
    }

    extractStaffData(payload) {
        const staff = {
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

        Object.keys(staff).forEach(
            key => staff[key] == undefined && delete staff[key]
        );
        return staff;
    }

    async findByUserName(userName) {
        return await this.Staff.findOne({
            userName: userName
        });
    }

    async findById(id) {
        var x = await this.Staff.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null
        });
        return x;
    }


    async create(payload) {
        const staff = this.extractStaffData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : null) : new ObjectId()
        };

        const update = {
            $set: staff
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Staff.findOneAndUpdate(
            filter, update, options
        );
        return {
            "userName": result.userName,
            "_id": result._id
        };
    }

    async findAll() {
        const staffs = await this.Staff.find({}).toArray();
        return staffs;
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
        const totalItems = await this.Staff.countDocuments(filter);
        const result = await this.Staff.find(filter).skip(skip).limit(limit).toArray();
        const totalPages = Math.ceil(totalItems / limit);
        return new PageResponse(
            result,
            totalItems,
            totalPages,
            page
        );
    }

    async update(payload) {
        const staff = this.extractStaffData(payload);
        var _id = payload._id;
        const filter = {
            _id: _id ? new ObjectId(_id) : new ObjectId()
        };

        const update = {
            $set: staff,
            $setOnInsert: {
                code: generateCode("NV"),
            }
        }
        const options = {
            upsert: true,
            returnDocument: "after"
        }
        const result = await this.Staff.findOneAndUpdate(
            filter, update, options
        );
        const { password, ...userWithoutPassword } = result;
        return userWithoutPassword;
    }
    async findByPhoneNumber(phoneNumber) {
        return await this.Staff.findOne({
            phoneNumber: phoneNumber
        });
    }

}

export default StaffRepository;