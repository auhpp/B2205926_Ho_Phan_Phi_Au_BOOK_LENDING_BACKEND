import ApiReponse from "../dto/response/api.response.js";
import ConfigurationService from "../services/configuration.service.js";
import ApiError from "../api-error.js";

export const update = async (req, res, next) => {
    try {
        const configurationService = new ConfigurationService();
        const configuration = await configurationService.update({ _id: req.params.id, value: req.body.value, unit: req.body.unit });
        return res.status(200).json(
            new ApiReponse("succes", "Update a configuration success", configuration)
        );
    } catch (error) {
        return next(error)
    }
}
export const findPagination = async (req, res, next) => {
    try {
        var configurations = [];
        const configurationService = new ConfigurationService();
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const name = req.query.name
        configurations = await configurationService.findPagination({ page: page, limit: limit, name });
        return res.status(200).json(
            new ApiReponse("succes", "Find all configuration success", configurations)
        );
    } catch (error) {
        return next(error)
    }
}

export const findAll = async (req, res, next) => {
    try {
        var configurations = [];
        const configurationService = new ConfigurationService();
        configurations = await configurationService.findAll();
        return res.status(200).json(
            new ApiReponse("succes", "Find all configuration success", configurations)
        );
    } catch (error) {
        return next(error)
    }
}


export const findByName = async (req, res, next) => {
    try {
        const configurationService = new ConfigurationService();
        const result = await configurationService.findByName(req.params.name);
        return res.status(200).json(
            new ApiReponse("succes", "Find a configuration success", result)
        );
    } catch (error) {
        return next(error)
    }
}