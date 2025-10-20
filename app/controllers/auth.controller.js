import AuthenticationRequest from "../dto/request/authentication.request.js";
import ApiReponse from "../dto/response/api.response.js";
import { Role } from "../enums/role.enum.js";
import AuthenticationService from "../services/authentication.service.js";

export const authenticateAdmin = async (req, res, next) => {
    const authenticationService = new AuthenticationService();
    const authenticationRequest = new AuthenticationRequest(req.body, Role.ADMIN);
    const authResponse = await authenticationService.authenticate(authenticationRequest);
    return res.status(200).json(
        new ApiReponse("succes", "Create a staff success", authResponse)
    );
}
