import ApiReponse from "../dto/response/api.response.js";
import AuthorService from "../services/author.service.js";

export const create = async (req, res, next) => {
    const authorService = new AuthorService();
    const author = await authorService.create({ _id: req.body.id, name: req.body.name });
    return res.status(200).json(
        new ApiReponse("succes", "Create a author success", author)
    );
}

export const findAll = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const authorService = new AuthorService();
    const result = await authorService.findAll({ page: page, limit: limit });
    return res.status(200).json(
        new ApiReponse("succes", "Find all category success", result)
    );
}

export const deleteAuthor = async (req, res, next) => {
    try {
        const authorService = new AuthorService();
        const document = await authorService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Author not found"));
        }
        return res.send({ message: "Author was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete author with id=${req.params.id}`)
        );
    }
}