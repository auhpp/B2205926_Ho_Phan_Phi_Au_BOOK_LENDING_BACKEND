import ApiReponse from "../dto/response/api.response.js";
import LoanSlipService from "../services/loanSlip.service.js";
import { Role } from "../enums/role.enum.js"
export const create = async (req, res, next) => {
    try {
        const loanSlipService = new LoanSlipService();
        const loanSlip = await loanSlipService.create(req.body);
        return res.status(200).json(
            new ApiReponse("success", "Create a loan slip success", loanSlip)
        );
    } catch (error) {
        return next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const loanSlipService = new LoanSlipService();
        const loanSlip = await loanSlipService.update({
            status: req.body.status,
            loanSlipId: req.params.id,
            staffId: req.body.staffId,
            currentUser: req.user,
        });
        return res.status(200).json(
            new ApiReponse("success", "Update a loan slip success", loanSlip)
        );
    } catch (error) {
        return next(error)
    }
}

export const findAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const status = req.query.status || null;
        const currentUser = req.user
        const readerId = currentUser.role == Role.ADMIN ? null : currentUser.id
        const keyword = req.query.keyword;
        const isPhoneNumber = /^[0-9]+$/.test(keyword) && keyword.startsWith('0');
        var readerPhoneNumber;
        var id;
        if (isPhoneNumber) {
            readerPhoneNumber = keyword
        } else {
            id = keyword
        }
        const loanSlipService = new LoanSlipService();
        const result = await loanSlipService.findAll({
            page: page, limit: limit, status: status, id: id,
            readerPhoneNumber: readerPhoneNumber,
            readerId: readerId
        });
        return res.status(200).json(
            new ApiReponse("success", "Find all loan slips success", result)
        );
    } catch (error) {
        return next(error)
    }
}


export const findById = async (req, res, next) => {
    try {
        const loanSlipService = new LoanSlipService();
        const result = await loanSlipService.findById(req.params.id);
        return res.status(200).json(
            new ApiReponse("success", "Find a loan slip by id success", result)
        );
    } catch (error) {
        return next(error)
    }
}

