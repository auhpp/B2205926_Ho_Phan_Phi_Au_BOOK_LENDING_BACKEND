import ApiError from "../api-error.js";
import BookCartItemRepository from "../repositories/bookCartItem.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import BookCopyRepository from "../repositories/bookCopy.repository.js";
import { BookCopyStatus } from "../enums/bookCopyStatus.enum.js";

class BookCartItemService {
    constructor() {
        this.bookCartItemRepository = new BookCartItemRepository(MongoDB.client);
        this.bookCopyRepository = new BookCopyRepository(MongoDB.client)
    }

    async create({ quantity, bookId, readerId }) {
        const bookCopyQuantity = this.bookCopyRepository.countByBookId(bookId, BookCopyStatus.AVAILABLE);
        if (bookCopyQuantity == 0) {
            throw new ApiError(400, "Book copy quantity not enough")
        }
        var bookCartItem = await this.bookCartItemRepository.findByBookIdAndReaderId({ bookId: bookId, readerId: readerId });
        if (bookCartItem) {
            bookCartItem.quantity = quantity;
            bookCartItem = await this.bookCartItemRepository.create(bookCartItem);
        }
        else {
            bookCartItem = await this.bookCartItemRepository.create({ quantity: quantity, readerId: readerId, bookId: bookId });
        }
        return bookCartItem;
    }

    async delete(id) {
        const bookCartItem = await this.bookCartItemRepository.delete(id);
        return bookCartItem;
    }

    async findPagination({ readerId, page = 1, limit = 10 }) {
        const bookCartItems = await this.bookCartItemRepository.findPagination({ readerId, page, limit });
        return bookCartItems;
    }

    async countDocuments(readerId) {
        const cnt = await this.bookCartItemRepository.countDocuments(readerId);
        return cnt;
    }

}

export default BookCartItemService;