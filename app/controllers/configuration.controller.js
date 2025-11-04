import ApiReponse from "../dto/response/api.response.js";
import ConfigurationService from "../services/configuration.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    const configurationService = new ConfigurationService();
    const configuration = await configurationService.create({ _id: req.body.id, value: req.body.value, unit: req.body.unit });
    return res.status(200).json(
        new ApiReponse("succes", "Create a configuration success", configuration)
    );
}

export const findAll = async (req, res, next) => {
    var configurations = [];
    const configurationService = new ConfigurationService();
    if (!parseInt(req.query.page) && !parseInt(req.query.limit)) {
        configurations = await configurationService.findAll();
    }
    else {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        configurations = await configurationService.findPagination({ page: page, limit: limit });
    }

    return res.status(200).json(
        new ApiReponse("succes", "Find all configuration success", configurations)
    );
}


export const findByName = async (req, res, next) => {
    const configurationService = new ConfigurationService();
    const result = await configurationService.findByName(req.params.name);
    return res.status(200).json(
        new ApiReponse("succes", "Find a configuration success", result)
    );
}