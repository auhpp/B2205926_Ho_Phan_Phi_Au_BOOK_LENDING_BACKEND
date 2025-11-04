import ApiError from "../api-error.js";
import ConfigurationRepository from "../repositories/configuration.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class ConfigurationService {
    constructor() {
        this.configurationRepository = new ConfigurationRepository(MongoDB.client);
    }

    async create({ _id = null, value, unit }) {
        if (value == "") {
            throw new ApiError(400, "Value cannot empty")
        }
        const configuration = this.configurationRepository.create({ _id, value: value, unit: unit });
        return configuration;
    }

    async findAll() {
        const result = await this.configurationRepository.findAll();
        return result;
    }
    async findByName(name) {
        const result = await this.configurationRepository.findByName(name);
        return result;
    }

    async findPagination({ page = 1, limit = 10 }) {
        const configurations = await this.configurationRepository.findPagination({ page, limit });
        return configurations;
    }
}

export default ConfigurationService;