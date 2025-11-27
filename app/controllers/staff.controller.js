import ApiError from "../api-error.js";
import ApiReponse from "../dto/response/api.response.js";
import StaffService from "../services/staff.service.js";

export const create = async (req, res, next) => {
    try {
        const staffService = new StaffService();
        const newStaff = await staffService.create({
            userName: req.body.userName, password: req.body.password,
            email: req.body.email
        });
        return res.status(201).json(
            new ApiReponse("succes", "Create a staff success", newStaff)
        );
    } catch (error) {
        return next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const staffService = new StaffService();
        const staff = await staffService.update({ id: req.params.id, active: req.body.active });
        return res.status(200).json(
            new ApiReponse("succes", "Update a staff success", staff)
        );
    } catch (error) {
        return next(error)
    }
}

export const findAll = async (req, res, next) => {
    try {
        var staffs = [];
        const staffService = new StaffService();
        staffs = await staffService.findAll();
        return res.status(200).json(
            new ApiReponse("succes", "Find all staff success", staffs)
        );
    } catch (error) {
        return next(error)
    }
}


export const findPagination = async (req, res, next) => {
    try {
        var staffs = [];
        const staffService = new StaffService();
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const userName = req.query.userName;
        staffs = await staffService.findPagination({ page: page, limit: limit, userName: userName });
        return res.status(200).json(
            new ApiReponse("succes", "Find pagination staff success", staffs)
        );
    } catch (error) {
        return next(error)
    }
}