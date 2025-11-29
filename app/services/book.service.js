import AuthorRepository from "../repositories/author.repository.js";
import BookRepository from "../repositories/book.repository.js";
import CategoryRepository from "../repositories/category.repository.js";
import PublisherRepository from "../repositories/publisher.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import BookCopyService from "./bookCopy.service.js";
import { deleteFromCloudinary, uploadFromBuffer } from "./cloudinary.service.js";
import { BookCopyStatus } from "../enums/bookCopyStatus.enum.js";
import LoanDetailRepository from "../repositories/loanDetail.repository.js";
import { Role } from "../enums/role.enum.js";
class BookService {
    constructor() {
        this.bookRepository = new BookRepository(MongoDB.client);
        this.categoryRepository = new CategoryRepository(MongoDB.client);
        this.authorRepository = new AuthorRepository(MongoDB.client);
        this.publisherRepository = new PublisherRepository(MongoDB.client);
        this.bookCopyService = new BookCopyService(MongoDB.client);
        this.loanDetailRepository = new LoanDetailRepository(MongoDB.client);
    }

    async create(bookData, files) {
        var imageUrls = [];
        if (files && files.length != 0) {
            const uploadPromises = files.map(file => uploadFromBuffer(file));
            imageUrls.push(...(await Promise.all(uploadPromises)));
        }
        var dataToSave = {
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
        dataToSave.active = true;

        var newBook = await this.bookRepository.create(dataToSave);

        if (!bookData.id) {
            await this.bookCopyService.create({ status: BookCopyStatus.AVAILABLE, bookId: newBook._id, quantity: bookData.bookCopyQuantity });
        }
        return newBook;
    }

    async update(bookData, files) {
        const oldBook = await this.bookRepository.findById(bookData.id);
        var imageUrls = [];
        if (bookData.images || files && files.length != 0) {
            if (bookData.images && (oldBook.images.length != bookData.images.length)) {
                const imageOldDeletes = oldBook.images.filter((item) =>
                    !bookData.images.includes(item)
                )
                const deletePromises = imageOldDeletes.map(element => {
                    var start = element.indexOf("book-lending-project");
                    const public_id = element.substring(start, element.lastIndexOf('.'));
                    console.log(public_id);

                    return deleteFromCloudinary(public_id);
                });
                await Promise.all(deletePromises);
            }
            else if (!bookData.images) {
                const deletePromises = oldBook.images.map(element => {
                    var start = element.indexOf("book-lending-project");
                    const public_id = element.substring(start, element.lastIndexOf('.'));
                    console.log(public_id);

                    return deleteFromCloudinary(public_id);
                });
                await Promise.all(deletePromises);
            }
            if (bookData.images && bookData.images.length > 0) {
                if (Array.isArray(bookData.images)) {
                    imageUrls.push(...bookData.images)
                }
                else {
                    imageUrls.push(bookData.images);
                }
            }
            if (files && files.length != 0) {
                const uploadPromises = files.map(file => uploadFromBuffer(file));
                imageUrls.push(...(await Promise.all(uploadPromises)));
            }
        }

        var dataToSave = {
            ...bookData,
            images: imageUrls.length == 0 ? undefined : imageUrls
        }
        console.log("book image", dataToSave.images)
        if (bookData.categoryIds) {
            const categories = await Promise.all(
                bookData.categoryIds.map(id => this.categoryRepository.findById(id))
            );
            dataToSave.categories = categories;
        }

        if (bookData.authorIds) {
            const authors = await Promise.all(
                bookData.authorIds.map(id => this.authorRepository.findById(id))
            );
            dataToSave.authors = authors;
        }
        if (bookData.publisherId) {
            var publisher = await this.publisherRepository.findById(bookData.publisherId);
            dataToSave.publisher = publisher;
        }

        var newBook = await this.bookRepository.create(dataToSave);
        return newBook;
    }


    async findAll({ page = 1, limit = 10, name = "", user, active }) {
        var activeFilter = active;
        if (user.role == Role.USER) {
            activeFilter = true
        }
        const books = await this.bookRepository.findAll({ page: page, limit: limit, name: name, active: activeFilter });
        return books;
    }

    async delete(id) {
        const loanDetails = await this.loanDetailRepository.findByBookCopyIdOrBookId({ bookId: id })
        console.log("loandetail", loanDetails)
        if (loanDetails.length != 0) {
            throw new ApiError(400, "Book is used, cannot delete")
        }
        const book = await this.bookRepository.delete(id);
        await this.bookCopyService.deleteMany(book._id);
        const deletePromises = book.images.map(element => {
            var start = element.indexOf("book-lending-project");
            const public_id = element.substring(start, element.lastIndexOf('.'));
            console.log(public_id);

            return deleteFromCloudinary(public_id);
        });
        await Promise.all(deletePromises);
        return book
    }

    async findById(id, user) {
        var active = null;
        if (user.role == Role.USER) {
            active = true
        }
        const book = await this.bookRepository.findById(id, active);
        if (book) {
            const cntBookCopy = await this.bookCopyService.countByBookId(id, BookCopyStatus.AVAILABLE);
            book.bookCopyQuantity = cntBookCopy;
        }
        return book;
    }
}

export default BookService;