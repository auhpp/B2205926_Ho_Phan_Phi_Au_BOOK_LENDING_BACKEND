import ApiReponse from "../dto/response/api.response.js";
import ApiError from "../api-error.js";
import BookCartItemService from "../services/bookCartItem.service.js";

export const create = async (req, res, next) => {
    try {
        const bookCartItemService = new BookCartItemService();
        const bookCartItem = await bookCartItemService.create({
            quantity: req.body.quantity, bookId: req.body.bookId, readerId: req.user.id
        });
        return res.status(200).json(
            new ApiReponse("succes", "Create a bookCartItem success", bookCartItem)
        );
    }
    catch (error) {
        return next(error)
    }
}

export const deleteBookCartItem = async (req, res, next) => {
    try {
        const bookCartItemService = new BookCartItemService();
        const document = await bookCartItemService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book cart item not found"));
        }
        return res.send({ message: "Book cart item was deleted successfully" });
    } catch (error) {
        return next(error);
    }
}

export const findAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const bookCartItemService = new BookCartItemService();
        const result = await bookCartItemService.findPagination({ readerId: req.user.id, page: page, limit: limit });
        return res.status(200).json(
            new ApiReponse("succes", "Find all book cart item success", result)
        );
    }
    catch (error) {
        return next(error)
    }
}

export const countDocuments = async (req, res, next) => {
    try {
        const bookCartItemService = new BookCartItemService();
        const result = await bookCartItemService.countDocuments(req.user.id);
        return res.status(200).json(
            new ApiReponse("succes", "Count book cart item success", result)
        );
    } catch (error) {
        return next(error)
    }

}
