import ApiError from "./../api-error.js";
import jwt from "jsonwebtoken";
import StaffRepository from "../repositories/staff.repository.js";
import ReaderRepository from "../repositories/reader.repository.js"
import MongoDB from "../utils/mongodb.util.js";
import { Role } from "../enums/role.enum.js";
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new ApiError(401, 'Authentication token is required.'));
        }
        const token = authHeader.split(' ')[1];
        const signerKey = process.env.SIGNER_KEY;
        const decoded = jwt.verify(token, signerKey);
        req.user = decoded;
        const staffRepository = new StaffRepository(MongoDB.client);
        const readerRepository = new ReaderRepository(MongoDB.client);
        var user = null;
        if (req.user.role == Role.ADMIN) {
            user = await staffRepository.findByUserName(req.user.userName);
        }
        else {
            user = await readerRepository.findByUserName(req.user.userName);
        }
        if (!user) {
            return next(new ApiError(401, 'User not found'));
        }
        if (!user.active) {
            return next(new ApiError(403, 'Account inactive'));
        }
        return next();
    } catch (error) {
        if (error.name == 'JsonWebTokenError') {
            return next(new ApiError(403, 'Invalid token.'));
        }
        if (error.name == 'TokenExpiredError') {
            return next(new ApiError(403, 'Token has expired.'));
        }
        return next(error);
    }
}

export default authMiddleware;