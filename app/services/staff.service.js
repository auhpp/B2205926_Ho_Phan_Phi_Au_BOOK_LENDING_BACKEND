import ApiError from "../api-error.js";
import StaffResponse from "../dto/response/staff.response.js";
import ReaderRepository from "../repositories/reader.repository.js";
import StaffRepository from "../repositories/staff.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import bcrypt from 'bcrypt';

class StaffService {
    constructor() {
        this.staffRepository = new StaffRepository(MongoDB.client);
        this.readerRepository = new ReaderRepository(MongoDB.client);
    }

    async create(staffRequest) {
        var staff = await this.staffRepository.findByUserName(staffRequest.userName);
        var reader = await this.staffRepository.findByUserName(staffRequest.userName);
        if (staff != null || reader != null) {
            throw new ApiError(401, "Username existed");
        }
        staffRequest.active = true;
        staffRequest.password = await bcrypt.hash(staffRequest.password, 10);
        staff = await this.staffRepository.create(staffRequest);
        return new StaffResponse(staff);
    }

    async existedStaff(userName) {
        const currentUser = await this.staffRepository.findByUserName(userName);
        return currentUser;
    }
}

export default StaffService;