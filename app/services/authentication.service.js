import ApiError from "../api-error.js";
import AuthenticationResponse from "../dto/response/authentication.response.js";
import ReaderRepository from "../repositories/reader.repository.js";
import StaffRepository from "../repositories/staff.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import MongoDB from "../utils/mongodb.util.js";
import { Role } from "../enums/role.enum.js";

class AuthenticationService {
    constructor() {
        this.staffRepository = new StaffRepository(MongoDB.client);
        this.readerRepository = new ReaderRepository(MongoDB.client);
    }

    async authenticate(authenticationRequest) {
        var account;
        if (authenticationRequest.role == Role.ADMIN) {
            account = await this.staffRepository.findByUserName(authenticationRequest.userName);
        }
        else {
            account = await this.readerRepository.findByUserName(authenticationRequest.userName);
        }
        if (account == null) {
            throw new ApiError(401, "Account not found");
        }
        if (account.active) {
            var response = new AuthenticationResponse();
            var valid = await bcrypt.compare(authenticationRequest.password, account.password);
            if (valid) {
                const token = this.generateToken(account.userName);
                response.authenticated = true;
                response.token = token;
                return response;
            }
            else {
                throw new ApiError(400, "Wrong password");
            }
        }
        else {
            throw new ApiError(400, "Account not active");
        }
    }

    generateToken(userName) {
        const signerKey = process.env.SIGNER_KEY;
        const options = {
            expiresIn: '3h',
            algorithm: 'HS256'
        }
        const token = jwt.sign({ userName: userName }, signerKey, options);
        return token;
    }


}


export default AuthenticationService;