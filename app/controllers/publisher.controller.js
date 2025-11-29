import ApiReponse from "../dto/response/api.response.js";
import PublisherService from "../services/publisher.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    try {
        const publisherService = new PublisherService();
        const publisher = await publisherService.create({ name: req.body.name });
        return res.status(200).json(
            new ApiReponse("success", "Create a publisher success", publisher)
        );
    } catch (error) {
        return next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const publisherService = new PublisherService();
        const publisher = await publisherService.update({ _id: req.params.id, name: req.body.name });
        return res.status(200).json(
            new ApiReponse("success", "Create a publisher success", publisher)
        );
    } catch (error) {
        return next(error)
    }
}

export const findPagination = async (req, res, next) => {
    try {
        var publishers = [];
        const publisherService = new PublisherService();
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const name = req.query.name;
        publishers = await publisherService.findPagination({ page: page, limit: limit, name: name });
        return res.status(200).json(
            new ApiReponse("success", "Find all publisher success", publishers)
        );
    } catch (error) {
        return next(error)
    }
}

export const findAll = async (req, res, next) => {
    try {
        var publishers = [];
        const publisherService = new PublisherService();
        publishers = await publisherService.findAll();
        return res.status(200).json(
            new ApiReponse("success", "Find all publisher success", publishers)
        );
    } catch (error) {
        return next(error)
    }
}

export const deletePublisher = async (req, res, next) => {
    try {
        const publisherService = new PublisherService();
        const document = await publisherService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.send({ message: "publisher was deleted successfully" });
    } catch (error) {
        return next(error);
    }
}