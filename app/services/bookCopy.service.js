import BookCopyRepository from "../repositories/bookCopy.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class BookCopyService {
    constructor() {
        this.bookCopyRepository = new BookCopyRepository(MongoDB.client);
    }

    async create(bookCopyRequest) {
        if (bookCopyRequest.bookId == "" || bookCopyRequest.status == "") {
            throw new ApiError(400, "Params not valid")
        }
        const bookCopyCount = await this.bookCopyRepository.countByBookId(bookCopyRequest.bookId);
        var barCode = bookCopyRequest.bookId + "-" + (bookCopyCount + 1);
        bookCopyRequest.barCode = barCode;
        const bookCopy = await this.bookCopyRepository.create(bookCopyRequest);
        return bookCopy;
    }
}

export default BookCopyService;