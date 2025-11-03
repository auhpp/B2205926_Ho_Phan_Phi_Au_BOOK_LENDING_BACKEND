import ApiReponse from "../dto/response/api.response.js";
import CategoryService from "../services/category.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    const categoryService = new CategoryService();
    const category = await categoryService.create({ _id: req.body.id, name: req.body.name });
    return res.status(200).json(
        new ApiReponse("succes", "Create a category success", category)
    );
}

export const findAll = async (req, res, next) => {
    var categories = [];
    const categoryService = new CategoryService();
    if (!parseInt(req.query.page) && !parseInt(req.query.limit)) {
        categories = await categoryService.findAll();
    }
    else {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        categories = await categoryService.findPagination({ page: page, limit: limit });
    }

    return res.status(200).json(
        new ApiReponse("succes", "Find all category success", categories)
    );
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
        return next(
            new ApiError(500, `Could not delete category with id=${req.params.id}`)
        );
    }
}