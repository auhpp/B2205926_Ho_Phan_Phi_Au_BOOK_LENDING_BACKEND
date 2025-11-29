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
            new ApiReponse("success", "Create a staff success", newStaff)
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
            new ApiReponse("success", "Update a staff success", staff)
        );
    } catch (error) {
        return next(error)
    }
}


export const updateInfo = async (req, res, next) => {
    try {
        const userData = req.body;
        const avatarFile = req.file;
        const currentUser = req.user;
        const staffService = new StaffService();
        const newStaff = await staffService.updateInfo({ _id: req.params.id, ...userData }, avatarFile, currentUser);
        return res.status(201).json(
            new ApiReponse("success", "Update info a staff success", newStaff)
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
            new ApiReponse("success", "Find all staff success", staffs)
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
        const active = req.query.active;
        staffs = await staffService.findPagination({ page: page, limit: limit, userName: userName, active: active });
        return res.status(200).json(
            new ApiReponse("success", "Find pagination staff success", staffs)
        );
    } catch (error) {
        return next(error)
    }
}