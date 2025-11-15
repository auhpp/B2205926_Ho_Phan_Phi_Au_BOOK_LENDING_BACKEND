import AuthorRepository from "../repositories/author.repository.js";
import BookRepository from "../repositories/book.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import PublisherRepository from "../repositories/publisher.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import BookCopyService from "./bookCopy.service.js";
import { deleteFromCloudinary, uploadFromBuffer } from "./cloudinary.service.js";
import { Status } from "./../enums/status.enum.js";
import { BookCopyStatus } from "../enums/bookCopyStatus.enum.js";
class BookService {
    constructor() {
        this.bookRepository = new BookRepository(MongoDB.client);
        this.categoryRepository = new CategoryRepository(MongoDB.client);
        this.authorRepository = new AuthorRepository(MongoDB.client);
        this.publisherRepository = new PublisherRepository(MongoDB.client);
        this.bookCopyService = new BookCopyService();
    }

    async create(bookData, files) {

        if (bookData.id == "" && (bookData.name == "" || bookData.price == null || bookData.publisherId == null
            || bookData.categoryIds.length == 0 || bookData.authorIds.length == 0 || bookData.bookCopyQuantity == "")) {
            throw new ApiError(400, "Params not valid")
        }
        var imageUrls = [];
        if (bookData.images && bookData.images.length > 0) {
            if (Array.isArray(bookData.images)) {
                imageUrls.push(...bookData.images)
            }
            else {
                imageUrls.push(bookData.images);
            }
        }
        if (files || files.length != 0) {
            const uploadPromises = files.map(file => uploadFromBuffer(file));
            imageUrls.push(...(await Promise.all(uploadPromises)));
        }

        var dataToSave = {
            ...bookData,
            images: imageUrls
        }
        var categories = []
        if (Array.isArray(bookData.categoryIds)) {
            categories = await Promise.all(
                bookData.categoryIds.map(id => this.categoryRepository.findById(id))
            );
        }
        else {
            categories.push(await this.categoryRepository.findById(bookData.categoryIds));
        }

        var authors = [];
        if (Array.isArray(bookData.authorIds)) {
            authors = await Promise.all(
                bookData.authorIds.map(id => this.authorRepository.findById(id))
            );
        }
        else {
            authors.push(await this.authorRepository.findById(bookData.authorIds));
        }
        var publisher = await this.publisherRepository.findById(bookData.publisherId);

        dataToSave.categories = categories;
        dataToSave.authors = authors;
        dataToSave.publisher = publisher;

        var newBook = await this.bookRepository.create(dataToSave);

        if (!bookData.id) {
            await this.bookCopyService.create({ status: BookCopyStatus.AVAILABLE, bookId: newBook._id, quantity: bookData.bookCopyQuantity });
        }
        return newBook;
    }


    async findAll({ page = 1, limit = 10 }) {
        const books = await this.bookRepository.findAll(page, limit);
        return books;
    }

    async delete(id) {
        const book = await this.bookRepository.delete(id);
        await this.bookCopyService.deleteMany(book._id);
        const deletePromises = book.images.map(element => {
            var start = element.indexOf("book-lending-project");
            const public_id = element.substring(start, element.lastIndexOf('.'));
            console.log(public_id);

            return deleteFromCloudinary(public_id);
        });
        await Promise.all(deletePromises);
        console.log("xoa", id);
        return book
    }

    async findById(id) {
        const book = await this.bookRepository.findById(id);
        const cntBookCopy = await this.bookCopyService.countByBookId(id, BookCopyStatus.AVAILABLE);
        book.bookCopyQuantity = cntBookCopy;
        return book;
    }
}

export default BookService;