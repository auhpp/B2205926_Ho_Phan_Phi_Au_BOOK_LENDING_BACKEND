import AuthorRepository from "../repositories/author.repository.js";
import BookRepository from "../repositories/book.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import PublisherRepository from "../repositories/publisher.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import BookCopyService from "./bookCopy.service.js";
import { deleteFromCloudinary, uploadFromBuffer } from "./cloudinary.service.js";

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
        if (files || files.length != 0) {
            const uploadPromises = files.map(file => uploadFromBuffer(file));
            imageUrls = await Promise.all(uploadPromises);
        }
        if (bookData.images && bookData.images.length > 0) {
            imageUrls.push(...bookData.images)
        }

        const dataToSave = {
            ...bookData,
            images: imageUrls
        }
        const categories = await Promise.all(
            bookData.categoryIds.map(id => this.categoryRepository.findById(id))
        );

        const authors = await Promise.all(
            bookData.authorIds.map(id => this.authorRepository.findById(id))
        );
        const publisher = await this.publisherRepository.findById(bookData.publisherId);

        dataToSave.categories = categories;
        dataToSave.authors = authors;
        dataToSave.publisher = publisher;

        const newBook = await this.bookRepository.create(dataToSave);

        for (var i = 0; i < bookData.bookCopyQuantity; i++) {
            await this.bookCopyService.create({ status: "active", bookId: newBook._id });
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
        book.images.forEach(async element => {
            var start = element.indexOf("book-lending-project");
            const public_id = element.substring(start, element.lastIndexOf('.'));
            console.log(public_id);
            await deleteFromCloudinary(public_id);
        });
        return book
    }
}

export default BookService;