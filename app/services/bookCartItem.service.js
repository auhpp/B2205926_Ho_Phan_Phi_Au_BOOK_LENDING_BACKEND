import ApiError from "../api-error.js";
import BookCartItemRepository from "../repositories/bookCartItem.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class BookCartItemService {
    constructor() {
        this.bookCartItemRepository = new BookCartItemRepository(MongoDB.client);
    }

    async create({ _id = null, quantity, bookId, readerId }) {
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
}

export default BookCartItemService;