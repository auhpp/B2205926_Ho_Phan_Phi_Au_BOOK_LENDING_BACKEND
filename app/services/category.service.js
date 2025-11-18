import ApiError from "../api-error.js";
import CategoryRepository from "../repositories/category.repository.js";
import MongoDB from "../utils/mongodb.util.js";
import BookRepository from "../repositories/book.repository.js";

class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository(MongoDB.client);
        this.bookRepository = new BookRepository(MongoDB.client);

    }

    async create({ name }) {
        var category = await this.categoryRepository.findByName(name);
        if (category != null) {
            throw new ApiError(400, "Existed category")
        }
        category = this.categoryRepository.create({ name: name });
        return category;
    }

    async update({ _id = null, name }) {
        var category = await this.categoryRepository.findByName(name);
        if (category != null) {
            throw new ApiError(400, "Existed category")
        }
        category = this.categoryRepository.create({ _id, name: name });
        return category;
    }

    async findAll() {
        const categories = await this.categoryRepository.findAll();
        return categories;
    }

    async delete(id) {
        const books = await this.bookRepository.findAll({ categoryId: id });
        if (books.data.length != 0) {
            throw new ApiError(400, "Category is used")
        }
        const category = await this.categoryRepository.delete(id);
        return category;
    }

    async findPagination({ page = 1, limit = 10, name = "" }) {
        const categories = await this.categoryRepository.findPagination({ page, limit, name });
        return categories;
    }
}

export default CategoryService;