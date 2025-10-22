import AuthorRepository from "../repositories/author.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class AuthorService {
    constructor() {
        this.authorRepository = new AuthorRepository(MongoDB.client);
    }

    async create({ _id, name }) {
        if (name == "") {
            throw new ApiError(400, "Name cannot empty")
        }
        const author = this.authorRepository.create({ _id, name: name });
        return author;
    }


    async findAll({ page = 1, limit = 10 }) {
        const authors = await this.authorRepository.findAll(page, limit);
        return authors;
    }

    async delete(id) {
        const author = await this.authorRepository.delete(id);
        return author;
    }
}

export default AuthorService;