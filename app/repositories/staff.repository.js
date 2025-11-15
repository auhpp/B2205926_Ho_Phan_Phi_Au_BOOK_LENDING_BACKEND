import { ObjectId } from "mongodb";

class StaffRepository {
    constructor(client) {
        this.Staff = client.db().collection("NHAN_VIEN");
    }

    extractStaffData(payload) {
        const staff = {
            userName: payload.userName,
            password: payload.password,
            active: payload.active
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
}

export default StaffRepository;