import AuthorRepository from "../repositories/author.repository.js";
import BookRepository from "../repositories/book.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class AuthorService {
    constructor() {
        this.authorRepository = new AuthorRepository(MongoDB.client);
        this.bookRepository = new BookRepository(MongoDB.client);
    }

    async create({ name }) {
        var author = await this.authorRepository.findByName(name);
        if (author != null) {
            throw new ApiError(400, "Existed author")
        }
        author = this.authorRepository.create({ name: name });
        return author;
    }

    async update({ _id, name }) {
        var author = await this.authorRepository.findByName(name);
        if (author != null) {
            throw new ApiError(400, "Existed author")
        }
        author = this.authorRepository.create({ _id, name: name });
        return author;
    }

    async findAll() {
        const authors = await this.authorRepository.findAll();
        return authors;
    }

    async findPagination({ page = 1, limit = 10, name = "" }) {
        const authors = await this.authorRepository.findPagination({ page, limit, name });
        return authors;
    }

    async delete(id) {
        const books = await this.bookRepository.findAll({ authorId: id })
        if (books.data.length != 0) {
            throw new ApiError(400, "Author is used")

        }
        const author = await this.authorRepository.delete(id);
        return author;
    }
}

export default AuthorService;