import ApiReponse from "../dto/response/api.response.js";
import BookCopyService from "../services/bookCopy.service.js";

export const create = async (req, res, next) => {
    try {
        const bookCopyService = new BookCopyService()
        const bookCopy = await bookCopyService.create(req.body);
        return res.status(200).json(
            new ApiReponse("success", "Create a book copy success", bookCopy)
        );
    } catch (error) {
        return next(error)
    }
}

export const update = async (req, res, next) => {
    try {
        const bookCopyService = new BookCopyService()
        const bookCopy = await bookCopyService.update({ _id: req.params.id, ...req.body });
        return res.status(200).json(
            new ApiReponse("success", "Update a book copy success", bookCopy)
        );
    } catch (error) {
        return next(error)
    }
}

export const findByBookId = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const bookId = req.query.bookId;
        const status = req.query.status;
        const bookCopyService = new BookCopyService()
        const result = await bookCopyService.findAll({ bookId: bookId, page: page, limit: limit, status: status });
        return res.status(200).json(
            new ApiReponse("success", "Find all book copy success", result)
        );
    } catch (error) {
        return next(error)
    }

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
            return next(new ApiError(404, "Book copy not found"));
        }
        return res.send({ message: "Book copy was deleted successfully" });
    } catch (error) {
        return next(error);
    }
}


