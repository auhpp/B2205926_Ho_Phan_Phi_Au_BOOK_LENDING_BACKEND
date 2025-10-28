import ApiReponse from "../dto/response/api.response.js";
import PublisherService from "../services/publisher.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    const publisherService = new PublisherService();
    const publisher = await publisherService.create({ _id: req.body.id, name: req.body.name, address: req.body.address });
    return res.status(200).json(
        new ApiReponse("succes", "Create a publisher success", publisher)
    );
}

export const findAll = async (req, res, next) => {
    const publisherService = new PublisherService();
    const result = await publisherService.findAll();
    return res.status(200).json(
        new ApiReponse("succes", "Find all publisher success", result)
    );
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
        return next(
            new ApiError(500, `Could not delete publisher with id=${req.params.id}`)
        );
    }
}