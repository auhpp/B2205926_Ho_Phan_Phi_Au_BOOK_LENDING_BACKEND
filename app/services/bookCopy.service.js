import BookCopyRepository from "../repositories/bookCopy.repository.js";
import LoanDetailRepository from "../repositories/loanDetail.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class BookCopyService {
    constructor() {
        this.bookCopyRepository = new BookCopyRepository(MongoDB.client);
        this.loanDetailRepository = new LoanDetailRepository(MongoDB.client);
    }

    async create(bookCopyRequest) {
        var bookCopies = []
        var bookCopyCount = await this.bookCopyRepository.countByBookId(bookCopyRequest.bookId);
        for (let i = 0; i < bookCopyRequest.quantity; i++) {
            var barCode = bookCopyRequest.bookId + "-" + (bookCopyCount + 1);
            bookCopyRequest.barCode = barCode;
            bookCopyCount++;
            bookCopies.push(await this.bookCopyRepository.create(bookCopyRequest));
        }
        return bookCopies;
    }

    async update(bookCopyRequest) {
        const bookCopy = await this.bookCopyRepository.create(bookCopyRequest)
        return bookCopy;
    }

    async findAll({ bookId, page = 1, limit = 10, status }) {
        const bookCopies = await this.bookCopyRepository.findAll({ bookId, page, limit, status });
        return bookCopies;
    }

    async delete(id) {
        const loanDetails = await this.loanDetailRepository.findByBookCopyIdOrBookId({ bookCopyId: id })
        if (loanDetails.length != 0) {
            throw new ApiError(400, "Book copy is used, cannot delete")
        }
        const book = await this.bookCopyRepository.delete(id);
        return book;
    }


    async deleteMany(bookId) {
        const book = await this.bookCopyRepository.deleteMany(bookId);
        return book;
    }

    async countByBookId(bookId, status) {
        const cnt = await this.bookCopyRepository.countByBookId(bookId, status);
        return cnt;
    }
    async findById(id) {
        const book = await this.bookCopyRepository.findById(id);
        return book;
    }

}

export default BookCopyService;