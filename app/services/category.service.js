import ApiError from "../api-error.js";
import CategoryRepository from "../repositories/category.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class CategoryService {
    constructor() {
        this.categoryRepository = new CategoryRepository(MongoDB.client);
    }

    async create({ _id = null, name }) {
        var category = await this.categoryRepository.findByName(name);
        if (name == "" || category != null) {
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
        const category = await this.categoryRepository.delete(id);
        return category;
    }
}

export default CategoryService;