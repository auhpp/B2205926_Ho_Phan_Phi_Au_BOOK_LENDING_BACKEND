import BookCopyRepository from "../repositories/bookCopy.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class BookCopyService {
    constructor() {
        this.bookCopyRepository = new BookCopyRepository(MongoDB.client);
    }

    async create(bookCopyRequest) {
        if (bookCopyRequest.id && (bookCopyRequest.bookId == "" || bookCopyRequest.status == "")) {
            throw new ApiError(400, "Params not valid")
        }
        if (!bookCopyRequest.id) {
            const bookCopyCount = await this.bookCopyRepository.countByBookId(bookCopyRequest.bookId);
            var barCode = bookCopyRequest.bookId + "-" + (bookCopyCount + 1);
            bookCopyRequest.barCode = barCode;
        }
        const bookCopy = await this.bookCopyRepository.create(bookCopyRequest);
        return bookCopy;
    }

    async findAll({ page = 1, limit = 10 }) {
        const bookCopies = await this.bookCopyRepository.findAll(page, limit);
        return bookCopies;
    }

    async delete(id) {
        const book = await this.bookCopyRepository.delete(id);
        return book;
    }


    async deleteMany(bookId) {
        const book = await this.bookCopyRepository.deleteMany(bookId);
        return book;
    }


}

export default BookCopyService;