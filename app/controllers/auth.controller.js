import AuthenticationRequest from "../dto/request/authentication.request.js";
import ApiReponse from "../dto/response/api.response.js";
import { Role } from "../enums/role.enum.js";
import AuthenticationService from "../services/authentication.service.js";
import OtpService from "../services/otp.service.js";

export const authenticateAdmin = async (req, res, next) => {
    try {
        const authenticationService = new AuthenticationService();
        const authenticationRequest = new AuthenticationRequest(req.body, Role.ADMIN);
        const authResponse = await authenticationService.authenticate(authenticationRequest);
        return res.status(200).json(
            new ApiReponse("success", "Authenticate a staff success", authResponse)
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
            new ApiReponse("success", "Authenticate a reader success", authResponse)
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
            new ApiReponse("success", "Get current user success", authResponse)
        );
    } catch (error) {
        return next(error);
    }

}


export const sendOtp = async (req, res, next) => {
    try {
        const otpService = new OtpService();
        const { userName, role } = req.body;
        const response = await otpService.sendOtp({ userName: userName, role: role });
        return res.status(200).json(
            new ApiReponse("success", "Send otp success", response)
        );
    } catch (error) {
        return next(error);
    }

}

export const verifyOtp = async (req, res, next) => {
    try {
        const otpService = new OtpService();
        const { userName, otp } = req.body;
        const response = await otpService.verifyOtp(otp, userName);
        return res.status(200).json(
            new ApiReponse("success", "Verify otp success", response)
        );
    } catch (error) {
        return next(error);
    }
}

export const resetPassword = async (req, res, next) => {
    try {
        const authenticationService = new AuthenticationService();
        const { userName, otp, newPassword, role } = req.body;
        const response = await authenticationService.resetPassword({
            userName: userName, otp: otp, newPassword: newPassword,
            role: role
        })
        return res.status(200).json(
            new ApiReponse("success", "Verify otp success", response)
        );
    } catch (error) {
        return next(error);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const authenticationService = new AuthenticationService();
        const { oldPassword, newPassword } = req.body;
        const currentUser = req.user;
        const response = await authenticationService.changePassword({
            currentUser: currentUser, oldPassword: oldPassword,
            newPassword: newPassword
        })
        return res.status(200).json(
            new ApiReponse("success", "Change password success", response)
        );
    } catch (error) {
        return next(error)
    }
}
