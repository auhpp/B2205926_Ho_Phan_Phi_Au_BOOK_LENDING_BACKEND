import ApiError from "../api-error.js";
import ConfigurationRepository from "../repositories/configuration.repository.js";
import MongoDB from "../utils/mongodb.util.js";

class ConfigurationService {
    constructor() {
        this.configurationRepository = new ConfigurationRepository(MongoDB.client);
    }

    async update({ _id, value, unit }) {
        const configuration = this.configurationRepository.create({ _id, value: value, unit: unit });
        return configuration;
    }

   
    async findByName(name) {
        const result = await this.configurationRepository.findByName(name);
        return result;
    }

    async findPagination({ page = 1, limit = 10, name }) {
        const configurations = await this.configurationRepository.findPagination({ page, limit, name });
        return configurations;
    }
}

export default ConfigurationService;