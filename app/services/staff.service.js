import ApiError from "../api-error.js";
import ReaderRepository from "../repositories/reader.repository.js";
import StaffRepository from "../repositories/staff.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import bcrypt from 'bcrypt';

class StaffService {
    constructor() {
        this.staffRepository = new StaffRepository(MongoDB.client);
        this.readerRepository = new ReaderRepository(MongoDB.client);
    }

    async create({ userName, password, email }) {
        var staff = await this.staffRepository.findByUserName(userName);
        var reader = await this.readerRepository.findByUserName(userName);
        if (staff != null || reader != null) {
            throw new ApiError(400, "Username existed");
        }
        var active = true;
        password = await bcrypt.hash(password, 10);
        staff = await this.staffRepository.create({ userName: userName, password: password, active: active, email: email });
        return staff;
    }
    async update({ active, id }) {
        const staff = await this.staffRepository.create({ _id: id, active: active });
        return staff;
    }
    async existedStaff(userName) {
        const currentUser = await this.staffRepository.findByUserName(userName);
        return currentUser;
    }

    async findAll() {
        const staffs = await this.staffRepository.findAll();
        return staffs;
    }

    async findPagination({ page, limit, userName }) {
        const staffs = await this.staffRepository.findPagination({ page: page, limit: limit, userName: userName })
        return staffs
    }
}

export default StaffService;