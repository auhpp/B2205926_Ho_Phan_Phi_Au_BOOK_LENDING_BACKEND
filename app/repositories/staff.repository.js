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
        const result = await this.Staff.insertOne(staff);
        return await this.findById(result.insertedId);
    }
}

export default StaffRepository;