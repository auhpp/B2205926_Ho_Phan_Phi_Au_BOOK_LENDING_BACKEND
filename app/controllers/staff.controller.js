import ApiError from "../api-error.js";
import ApiReponse from "../dto/response/api.response.js";
import StaffService from "../services/staff.service.js";

export const create = async (req, res, next) => {
    const staffService = new StaffService();
    const currentUser = staffService.existedStaff(req.userName);
    if (currentUser == null) {
        return next(new ApiError(403, "Forbian"));
    }
    const newStaff = await staffService.create({ userName: req.body.userName, password: req.body.password });
    return res.status(201).json(
        new ApiReponse("succes", "Create a staff success", newStaff)
    );
}
