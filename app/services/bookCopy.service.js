import BookCopyRepository from "../repositories/bookCopy.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class BookCopyService {
    constructor() {
        this.bookCopyRepository = new BookCopyRepository(MongoDB.client);
    }

    async create(bookCopyRequest) {
        if (bookCopyRequest.id && (bookCopyRequest.bookId == "" || bookCopyRequest.quantity == "" || bookCopyRequest.status == "")) {
            throw new ApiError(400, "Params not valid")
        }
        var bookCopies = []
        if (!bookCopyRequest.id) {
            var bookCopyCount = await this.bookCopyRepository.countByBookId(bookCopyRequest.bookId);
            for (let i = 0; i < bookCopyRequest.quantity; i++) {
                var barCode = bookCopyRequest.bookId + "-" + (bookCopyCount + 1);
                bookCopyRequest.barCode = barCode;
                bookCopyCount++;
                bookCopies.push(await this.bookCopyRepository.create(bookCopyRequest));
            }
        }
        else
            bookCopies.push(await this.bookCopyRepository.create(bookCopyRequest))
        return bookCopies;
    }

    async findAll({ bookId, page = 1, limit = 10 }) {
        const bookCopies = await this.bookCopyRepository.findAll({ bookId, page, limit });
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

    async countByBookId(bookId) {
        const cnt = await this.bookCopyRepository.countByBookId(bookId);
        return cnt;
    }
    async findById(id) {
        const book = await this.bookCopyRepository.findById(id);
        return book;
    }

}

export default BookCopyService;