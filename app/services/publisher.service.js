import ApiError from "../api-error.js";
import PublisherRepository from "../repositories/publisher.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class PublisherService {
    constructor() {
        this.publisherRepository = new PublisherRepository(MongoDB.client);
    }

    async create({ _id = null, name, address }) {
        if (name == "") {
            throw new ApiError(400, "Name cannot empty")
        }
        const publisher = this.publisherRepository.create({ _id, name: name, address });
        return publisher;
    }


    async findAll() {
        const result = await this.publisherRepository.findAll();
        return result;
    }

    async delete(id) {
        const publisher = await this.publisherRepository.delete(id);
        return publisher;
    }
}

export default PublisherService;