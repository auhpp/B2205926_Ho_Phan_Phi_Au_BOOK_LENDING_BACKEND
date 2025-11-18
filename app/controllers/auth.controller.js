import AuthenticationRequest from "../dto/request/authentication.request.js";
import ApiReponse from "../dto/response/api.response.js";
import { Role } from "../enums/role.enum.js";
import AuthenticationService from "../services/authentication.service.js";

export const authenticateAdmin = async (req, res, next) => {
    try {
        const authenticationService = new AuthenticationService();
        const authenticationRequest = new AuthenticationRequest(req.body, Role.ADMIN);
        const authResponse = await authenticationService.authenticate(authenticationRequest);
        return res.status(200).json(
            new ApiReponse("succes", "Authenticate a staff success", authResponse)
        );
    } catch (error) {
        return next(error)
    }

}

export const authenticateUser = async (req, res, next) => {
    try {
        const authenticationService = new AuthenticationService();
        const authenticationRequest = new AuthenticationRequest(req.body, Role.USER);
        const authResponse = await authenticationService.authenticate(authenticationRequest);
        return res.status(200).json(
            new ApiReponse("succes", "Authenticate a reader success", authResponse)
        );
    } catch (error) {
        return next(error)
    }

}

export const getCurrentUser = async (req, res, next) => {
    try {
        const authenticationService = new AuthenticationService();
        const authResponse = await authenticationService.getCurrentUser({ userName: req.user.userName, role: req.user.role });
        return res.status(200).json(
            new ApiReponse("succes", "Get current user success", authResponse)
        );
    } catch (error) {
        return next(error);
    }

}