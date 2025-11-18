import ApiReponse from "../dto/response/api.response.js";
import AuthorService from "../services/author.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    try {
        const authorService = new AuthorService();
        const author = await authorService.create({ _id: req.body.id, name: req.body.name });
        return res.status(200).json(
            new ApiReponse("succes", "Create a author success", author)
        );
    } catch (error) {
        return next(error);
    }
}

export const update = async (req, res, next) => {
    try {
        const authorService = new AuthorService();
        const author = await authorService.update({ _id: req.params.id, name: req.body.name });
        return res.status(200).json(
            new ApiReponse("succes", "Create a author success", author)
        );
    } catch (error) {
        return next(error);
    }
}

export const findPagination = async (req, res, next) => {
    try {
        var authors = [];
        const authorService = new AuthorService();
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const name = req.query.name;
        authors = await authorService.findPagination({ page: page, limit: limit, name });
        return res.status(200).json(
            new ApiReponse("succes", "Find all author success", authors)
        );
    } catch (error) {
        return next(error);
    }
}

export const findAll = async (req, res, next) => {
    try {
        var authors = [];
        const authorService = new AuthorService();
        authors = await authorService.findAll();
        return res.status(200).json(
            new ApiReponse("succes", "Find all author success", authors)
        );
    } catch (error) {
        return next(error);
    }
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
        return next(error);
    }
}