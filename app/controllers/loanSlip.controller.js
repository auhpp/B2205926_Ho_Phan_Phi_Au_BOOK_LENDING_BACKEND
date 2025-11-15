import ApiReponse from "../dto/response/api.response.js";
import LoanSlipService from "../services/loanSlip.service.js";

export const create = async (req, res, next) => {
    const loanSlipService = new LoanSlipService();
    var loanSlip = null;
    if (req.body._id) {
        loanSlip = await loanSlipService.update({ status: req.body.status, loanSlipId: req.body._id, staffId: req.body.staffId });
    }
    else {
        loanSlip = await loanSlipService.create(req.body);
    }
    return res.status(200).json(
        new ApiReponse("succes", "Create a loan slip success", loanSlip)
    );
}

export const findAll = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const loanSlipService = new LoanSlipService();
    const result = await loanSlipService.findAll({ page: page, limit: limit });
    return res.status(200).json(
        new ApiReponse("succes", "Find all loan slips success", result)
    );
}


export const findById = async (req, res, next) => {
    const loanSlipService = new LoanSlipService();
    const result = await loanSlipService.findById(req.params.id);
    return res.status(200).json(
        new ApiReponse("succes", "Find a loan slip by id success", result)
    );
}

