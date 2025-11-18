import ApiError from "../api-error.js";
import PublisherRepository from "../repositories/publisher.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import BookRepository from "../repositories/book.repository.js";

class PublisherService {
    constructor() {
        this.publisherRepository = new PublisherRepository(MongoDB.client);
        this.bookRepository = new BookRepository(MongoDB.client);

    }

    async create({ name, address }) {
        var publisher = await this.publisherRepository.findByName(name);
        if (publisher != null) {
            throw new ApiError(400, "Existed publisher")
        }
        publisher = this.publisherRepository.create({ name: name });
        return publisher;
    }

    async update({ _id, name, address }) {
        var publisher = await this.publisherRepository.findByName(name);
        if (publisher != null) {
            throw new ApiError(400, "Existed publisher")
        }
        publisher = this.publisherRepository.create({ _id, name: name });
        return publisher;
    }



    async findAll() {
        const result = await this.publisherRepository.findAll();
        return result;
    }

    async delete(id) {
        const books = await this.bookRepository.findAll({ publisherId: id })
        if (books.data.length != 0) {
            throw new ApiError(400, "Publisher is used")
        }
        const publisher = await this.publisherRepository.delete(id);
        return publisher;
    }

    async findPagination({ page = 1, limit = 10, name }) {
        const publishers = await this.publisherRepository.findPagination({ page, limit, name });
        return publishers;
    }
}

export default PublisherService;