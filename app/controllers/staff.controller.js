import ApiError from "../api-error.js";
import StaffRequest from "../dto/request/staff.request.js";
import ApiReponse from "../dto/response/api.response.js";
import StaffService from "../services/staff.service.js";

export const create = async (req, res, next) => {
    const staffService = new StaffService();
    const currentUser = staffService.existedStaff(req.user.userName);
    if (currentUser == null) {
        return next(new ApiError(403, "Forbian"));
    }
    const staffRequest = new StaffRequest(req.body);
    const newStaff = await staffService.create(staffRequest);
    return res.status(201).json(
        new ApiReponse("succes", "Create a staff success", newStaff)
    );
}
