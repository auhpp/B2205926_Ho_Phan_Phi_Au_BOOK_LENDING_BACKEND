import ApiError from "../api-error.js";
import { BookCopyStatus } from "../enums/bookCopyStatus.enum.js";
import { Configuration } from "../enums/configuration.enum.js";
import { LoanDetailStatus } from "../enums/loanDetailStatus.enum.js";
import { LoanSlipStatus } from "../enums/loanSlipStatus.enum.js";
import { Role } from "../enums/role.enum.js";
import BookCartItemRepository from "../repositories/bookCartItem.repository.js";
import BookCopyRepository from "../repositories/bookCopy.repository.js";
import ConfigurationRepository from "../repositories/configuration.repository.js";
import LoanDetailRepository from "../repositories/loanDetail.repository.js";
import LoanSlipRepository from "../repositories/loanSlip.repository.js";
import ReaderRepository from "../repositories/reader.repository.js";
import PenaltyTicketRepository from "../repositories/penaltyTicket.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class LoanSlipService {
    constructor() {
        this.loanSlipRepository = new LoanSlipRepository(MongoDB.client);
        this.bookCopyRepository = new BookCopyRepository(MongoDB.client)
        this.configurationRepository = new ConfigurationRepository(MongoDB.client)
        this.loanDetailRepository = new LoanDetailRepository(MongoDB.client);
        this.cartRepository = new BookCartItemRepository(MongoDB.client);
        this.readerRepository = new ReaderRepository(MongoDB.client);
        this.penaltyTicketRepository = new PenaltyTicketRepository(MongoDB.client);
    }

    async create(payload) {
        const maxBorrowLimit = await this.configurationRepository.findByName(Configuration.MAX_BORROW_LIMIT);
        // Check
        const readerId = payload.readerId;
        const books = payload.books;
        for (var i = 0; i < books.length; i++) {
            const bookCopyAvailableQuantity = await this.bookCopyRepository.countByBookId(books[i]._id, BookCopyStatus.AVAILABLE);
            if (bookCopyAvailableQuantity < books[i].quantity) {
                throw new ApiError(400, "Quantity not enough")

            }
        }
        const unpaidPenalties = await this.penaltyTicketRepository.findUnpaidByReaderId(readerId);

        if (unpaidPenalties && unpaidPenalties.length > 0) {
            throw new ApiError(400, "Reader has unpaid penalty tickets.");
        }
        const loanSlipFound = await this.loanSlipRepository.findByStatus(readerId, LoanSlipStatus.BORROWED);
        if (loanSlipFound) {
            throw new ApiError(400, "Have book not return")
        }
        const countBookBorrow = await this.loanSlipRepository.countBookByReaderId(readerId, LoanDetailStatus.BORROWED);
        if (countBookBorrow >= maxBorrowLimit.value) {
            throw new ApiError(400, "Reader borrow to limit")
        }
        var bookCopyRequest = [];
        for (var i = 0; i < books.length; i++) {
            const bookCopies = await this.bookCopyRepository.findAll({
                bookId: books[i]._id, status: BookCopyStatus.AVAILABLE,
                limit: books[i].quantity, page: 1
            });
            if (bookCopies.data.length < books[i].quantity) {
                throw new ApiError(400, "Quantity not enough")
            }
            else {
                console.log("Book copy", bookCopies)
                bookCopies.data.forEach(element => {
                    bookCopyRequest.push(element._id);
                    element.status = BookCopyStatus.PENDING;
                    this.bookCopyRepository.create(element);
                });
            }
        }
        const loanSlip = await this.loanSlipRepository.create({
            status: payload.status,
            readerId: payload.readerId,
            staffId: payload.staffId,
            createdAt: new Date()
        });

        var loanDetails = [];
        for (var i = 0; i < bookCopyRequest.length; i++) {
            const loanDetail = await this.loanDetailRepository.create({
                bookCopyId: bookCopyRequest[i],
                loanSlipId: loanSlip._id,
                status: LoanDetailStatus.PENDING
            })
            loanDetails.push(loanDetail);
        }
        loanSlip.loanDetails = loanDetails;
        for (var i = 0; i < books.length; i++) {
            const cart = await this.cartRepository.deleteByBookId(books[i]._id);
        }
        return loanSlip;
    }


    async findAll({ page = 1, limit = 10, status, id, readerId, readerPhoneNumber }) {
        var readerIdParam = readerId
        if (readerPhoneNumber) {
            const reader = await this.readerRepository.findByPhoneNumber(readerPhoneNumber)
            if (reader) {
                readerIdParam = reader._id;
            }
            else {
                return []
            }
        }
        const loanSlips = await this.loanSlipRepository.findAll({
            page: page, limit: limit, status: status, id: id,
            readerId: readerIdParam
        });

        return loanSlips;
    }


    async findById(id) {
        const loanSlip = await this.loanSlipRepository.findById(id);
        return loanSlip;
    }

    async update({ status, loanSlipId, staffId, currentUser }) {
        const { role, userName, id } = currentUser;
        const loanSlipDB = await this.loanSlipRepository.findById(loanSlipId);
        if (!loanSlipDB) {
            throw new ApiError(400, "Loan slip not found")
        }
        if (role == Role.USER) {
            if (loanSlipDB.reader._id.toString() !== id) {
                throw new ApiError(403, "Forbidden access")
            }
            if (status != LoanSlipStatus.REJECTED) {
                throw new ApiError(403, "User only cancel")
            }
        }
        else if (role == Role.ADMIN) {
            const allowedStatuses = [LoanSlipStatus.APPROVED, LoanDetailStatus.BORROWED, LoanSlipStatus.REJECTED]
            if (!allowedStatuses.includes(status)) {
                throw new ApiError(400, "Invalid status")
            }
        }

        var borrowedDate;
        var returnDate;
        if (status == LoanDetailStatus.BORROWED) {
            borrowedDate = new Date();
            const config = await this.configurationRepository.findByName(Configuration.DEFAULT_BORROW_DAYS)
            const duration = parseInt(config.value);
            returnDate = new Date(borrowedDate);
            returnDate.setDate(returnDate.getDate() + duration)
        }
        const loanSlipAfter = await this.loanSlipRepository.create({
            _id: loanSlipId, status: status, staffId: staffId, borrowedDate: borrowedDate, returnDate: returnDate
        });
        const loanDetailAfters = await this.loanDetailRepository.updateManyByLoanSlipId({ loanSlipId: loanSlipId, status: status });
        var bookCopyStatus = status;
        if (status == LoanSlipStatus.REJECTED) {
            bookCopyStatus = BookCopyStatus.AVAILABLE;
        }
        const loanDetails = await this.loanDetailRepository.findAllByLoanSlipId({ loanSlipId: loanSlipId });
        loanDetails.forEach(element => {
            this.bookCopyRepository.create({ status: bookCopyStatus, _id: element.bookCopyId })
        });
        return true;

    }

}

export default LoanSlipService;