import ApiReponse from "../dto/response/api.response.js";
import BookService from "../services/book.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    try {
        const bookData = req.body;
        const bookService = new BookService()
        const files = req.files;

        if (bookData.id == "" && (!files || files.length === 0)) {
            return res.status(400).json({ error: 'No images uploaded.' });
        }
        const newBook = await bookService.create(bookData, files);
        return res.status(201).json(
            new ApiReponse("succes", "Create a book success", newBook)
        );
    } catch (error) {
        console.error('Error creating book:', error.message);
    }
}

export const findAll = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const bookService = new BookService()
    const result = await bookService.findAll({ page: page, limit: limit });
    return res.status(200).json(
        new ApiReponse("succes", "Find all book success", result)
    );
}


export const deleteBook = async (req, res, next) => {
    try {
        const bookService = new BookService()
        const document = await bookService.delete(req.params.id);
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