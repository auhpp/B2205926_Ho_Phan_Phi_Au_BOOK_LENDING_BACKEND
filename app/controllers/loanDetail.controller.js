import ApiReponse from "../dto/response/api.response.js";
import LoanDetailService from "../services/loanDetail.service.js";

export const update = async (req, res, next) => {
    try {
        const loanDetailService = new LoanDetailService();
        const loanDetailUpdated = await loanDetailService.update({ id: req.params.id, ...req.body });
        return res.status(200).json(
            new ApiReponse("success", "Update a loan detail success", loanDetailUpdated)
        );
    } catch (error) {
        return next(error)
    }
}