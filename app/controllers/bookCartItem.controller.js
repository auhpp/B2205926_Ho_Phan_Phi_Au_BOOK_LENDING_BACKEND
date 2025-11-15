import ApiReponse from "../dto/response/api.response.js";
import ApiError from "../api-error.js";
import BookCartItemService from "../services/bookCartItem.service.js";

export const create = async (req, res, next) => {
    const bookCartItemService = new BookCartItemService();
    const bookCartItem = await bookCartItemService.create({
        _id: req.body._id, quantity: req.body.quantity, bookId: req.body.bookId, readerId: req.user.id

    });
    return res.status(200).json(
        new ApiReponse("succes", "Create a bookCartItem success", bookCartItem)
    );
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
        return next(
            new ApiError(500, `Could not delete book cart item with id=${req.params.id}`)
        );
    }
}

export const findAll = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const bookCartItemService = new BookCartItemService();
    const result = await bookCartItemService.findPagination({ readerId: req.user.id, page: page, limit: limit });
    return res.status(200).json(
        new ApiReponse("succes", "Find all book cart item success", result)
    );
}
