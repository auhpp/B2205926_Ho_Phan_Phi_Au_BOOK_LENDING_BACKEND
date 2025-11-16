import ApiReponse from "../dto/response/api.response.js";
import BookCopyService from "../services/bookCopy.service.js";

export const create = async (req, res, next) => {
    const bookCopyService = new BookCopyService()
    const author = await bookCopyService.create(req.body);
    return res.status(200).json(
        new ApiReponse("succes", "Create a author success", author)
    );
}


export const findByBookId = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const bookId = req.query.bookId;
    const status = req.query.status;

    const bookCopyService = new BookCopyService()
    const result = await bookCopyService.findAll({ bookId: bookId, page: page, limit: limit, status: status });
    return res.status(200).json(
        new ApiReponse("succes", "Find all book copy success", result)
    );
}


export const deleteBookCopy = async (req, res, next) => {
    try {
        const bookCopyService = new BookCopyService()
        const bookCopy = await bookCopyService.findById(req.params.id);
        const bookCopyQuantity = await bookCopyService.countByBookId(bookCopy.bookId);
        if (bookCopyQuantity == 1) {
            return next(new ApiError(400, "Quantity not valid"));
        }
        const document = await bookCopyService.delete(req.params.id);
        if (!document) {
            return next(new ApiError(404, "Book not found"));
        }
        return res.send({ message: "Book was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Could not delete book with id=${req.params.id}`)
        );
    }
}


