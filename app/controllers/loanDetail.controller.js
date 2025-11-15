import ApiReponse from "../dto/response/api.response.js";
import LoanDetailService from "../services/loanDetail.service.js";

export const create = async (req, res, next) => {
    const loanDetailService = new LoanDetailService();
    const loanDetailUpdated = await loanDetailService.update(req.body);
    return res.status(200).json(
        new ApiReponse("succes", "Update a loan detail success", loanDetailUpdated)
    );
}