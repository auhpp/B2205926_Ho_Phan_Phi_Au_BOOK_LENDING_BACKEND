import ApiError from "../api-error.js";
import { LoanDetailStatus } from "../enums/loanDetailStatus.enum.js";
import { LoanSlipStatus } from "../enums/loanSlipStatus.enum.js";
import { BookCopyStatus } from "../enums/bookCopyStatus.enum.js";
import BookCopyRepository from "../repositories/bookCopy.repository.js";
import LoanDetailRepository from "../repositories/loanDetail.repository.js";
import LoanSlipRepository from "../repositories/loanSlip.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class LoanDetailService {
    constructor() {
        this.loanDetailRepository = new LoanDetailRepository(MongoDB.client);
        this.bookCopyRepository = new BookCopyRepository(MongoDB.client);
        this.loanSlipRepository = new LoanSlipRepository(MongoDB.client);
    }

    async update(payload) {
        try {
            const status = payload.status;
            const loanDetailUpdated = await this.loanDetailRepository.create(payload);
            var bookCopyStatus = payload.status;
            if (payload.status == LoanDetailStatus.RETURNED) {
                bookCopyStatus = BookCopyStatus.AVAILABLE;
            }
            const bookCopyUpdated = await this.bookCopyRepository.create({ _id: payload.bookCopyId, status: bookCopyStatus });
            const loanDetails = await this.loanDetailRepository.findAllByLoanSlipId({ loanSlipId: payload.loanSlipId });
            var valid = true;
            loanDetails.forEach(element => {
                if (element.status == LoanDetailStatus.BORROWED) {
                    valid = false
                }
            });
            if (valid) {
                const loanSlipUpdated = await this.loanSlipRepository.create({
                    _id: payload.loanSlipId, status: LoanSlipStatus.RETURNED,
                    returnedDate: new Date()
                })
            }
            return true;
        } catch (error) {
            throw new ApiError(400, "Error update a loan detail: " + error)
        }

    }


}

export default LoanDetailService;