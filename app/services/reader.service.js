import ApiError from "../api-error.js";
import ReaderRepository from "../repositories/reader.repository.js";
import StaffRepository from "../repositories/staff.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import bcrypt from 'bcrypt';
import { uploadFromBuffer } from "./cloudinary.service.js";

class ReaderService {
    constructor() {
        this.staffRepository = new StaffRepository(MongoDB.client);
        this.readerRepository = new ReaderRepository(MongoDB.client);
    }

    async create({ userName, password }) {
        var staff = await this.staffRepository.findByUserName(userName);
        var reader = await this.readerRepository.findByUserName(userName);
        if (staff != null || reader != null) {
            throw new ApiError(401, "Username existed");
        }
        var active = true;
        password = await bcrypt.hash(password, 10);
        reader = await this.readerRepository.create({ userName: userName, password: password, active: active });
        return reader;
    }

    async updateInfo(payload, avatar, currentUser) {
        const { userName } = currentUser;
        const readerDB = await this.readerRepository.findById(payload._id);
        if (readerDB.userName !== userName) {
            throw new ApiError(403, "Forbidden access")
        }
        var imageUrl = undefined;
        if (avatar != null) {
            imageUrl = await uploadFromBuffer(avatar);
        }
        payload.avatar = imageUrl;
        const reader = await this.readerRepository.update(payload);
        return reader;
    }

}

export default ReaderService;