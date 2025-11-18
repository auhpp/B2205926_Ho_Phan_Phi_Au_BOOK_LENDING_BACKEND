import ApiReponse from "../dto/response/api.response.js";
import CategoryService from "../services/category.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    try {
        const categoryService = new CategoryService();
        const category = await categoryService.create({ name: req.body.name });
        return res.status(200).json(
            new ApiReponse("succes", "Create a category success", category)
        );
    } catch (error) {
        return next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const categoryService = new CategoryService();
        const category = await categoryService.update({ _id: req.params.id, name: req.body.name });
        return res.status(200).json(
            new ApiReponse("succes", "Update a category success", category)
        );
    } catch (error) {
        return next(error)
    }
}

export const findPagination = async (req, res, next) => {
    try {
        var categories = [];
        const categoryService = new CategoryService();
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const name = req.query.name;
        categories = await categoryService.findPagination({ page: page, limit: limit, name });
        return res.status(200).json(
            new ApiReponse("succes", "Find all category success", categories)
        );
    } catch (error) {
        return next(error)
    }
}

export const findAll = async (req, res, next) => {
    try {
        var categories = [];
        const categoryService = new CategoryService();
        categories = await categoryService.findAll();
        return res.status(200).json(
            new ApiReponse("succes", "Find all category success", categories)
        );
    } catch (error) {
        return next(error)
    }
}

export const deleteCategory = async (req, res, next) => {
    try {
        const categoryService = new CategoryService();
        const document = await categoryService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Category not found"));
        }
        return res.send({ message: "Category was deleted successfully" });
    } catch (error) {
        return next(error);
    }
}