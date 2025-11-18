import ApiReponse from "../dto/response/api.response.js";
import LoanSlipService from "../services/loanSlip.service.js";

export const create = async (req, res, next) => {
    try {
        const loanSlipService = new LoanSlipService();
        const loanSlip = await loanSlipService.create(req.body);
        return res.status(200).json(
            new ApiReponse("succes", "Create a loan slip success", loanSlip)
        );
    } catch (error) {
        return next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const loanSlipService = new LoanSlipService();
        const loanSlip = await loanSlipService.update({ status: req.body.status, loanSlipId: req.params.id, staffId: req.body.staffId });
        return res.status(200).json(
            new ApiReponse("succes", "Update a loan slip success", loanSlip)
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
        const id = req.query.id;
        const loanSlipService = new LoanSlipService();
        const result = await loanSlipService.findAll({ page: page, limit: limit, status: status, id: id });
        return res.status(200).json(
            new ApiReponse("succes", "Find all loan slips success", result)
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
            new ApiReponse("succes", "Find a loan slip by id success", result)
        );
    } catch (error) {
        return next(error)
    }
}

