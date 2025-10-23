import AuthorRepository from "../repositories/author.repository.js";
import BookRepository from "../repositories/book.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import PublisherRepository from "../repositories/publisher.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import BookCopyService from "./bookCopy.service.js";
import uploadFileToS3 from "./s3.service.js";

class BookService {
    constructor() {
        this.bookRepository = new BookRepository(MongoDB.client);
        this.categoryRepository = new CategoryRepository(MongoDB.client);
        this.authorRepository = new AuthorRepository(MongoDB.client);
        this.publisherRepository = new PublisherRepository(MongoDB.client);
        this.bookCopyService = new BookCopyService();
    }

    async create(bookData, files) {
        if (bookData.id == "" || bookData.id == null) {
            if (bookData.name == "" || bookData.price == null || bookData.publisherId == null
                || bookData.categoryIds.length == 0 || bookData.authorIds.length == 0 || bookData.bookCopyQuantity == "") {
                throw new ApiError(400, "Params not valid")
            }
            const uploadPromises = files.map(file => uploadFileToS3(file));

            const imageUrls = await Promise.all(uploadPromises);
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
                const bookCopy = await this.bookCopyService.create({ status: "active", bookId: newBook._id });
            }
            return newBook;
        }
    }


    async findAll({ page = 1, limit = 10 }) {
        const authors = await this.bookRepository.findAll(page, limit);
        return authors;
    }

    async delete(id) {
        const author = await this.bookRepository.delete(id);
        return author;
    }
}

export default BookService;