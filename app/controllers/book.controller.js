import ApiReponse from "../dto/response/api.response.js";
import BookService from "../services/book.service.js";
import ApiError from "../api-error.js";

export const create = async (req, res, next) => {
    try {
        const bookData = req.body;
        const bookService = new BookService()
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded.' });
        }
        const newBook = await bookService.create(bookData, files);
        return res.status(201).json(
            new ApiReponse("succes", "Create a book success", newBook)
        );
    } catch (error) {
        return next(error);
    }
}

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Don't have book id" });
        }
        const bookData = req.body;
        bookData.id = id;
        const bookService = new BookService()

        const files = req.files;
        const newBook = await bookService.update(bookData, files);
        return res.status(201).json(
            new ApiReponse("succes", "Update a book success", newBook)
        );
    } catch (error) {
        return next(error);
    }
}

export const findAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const name = req.query.name;
        var active = req.query.active;
        if (active !== undefined && active !== null) {
            active = (String(active) === 'true');
        }
        console.log(active)
        const bookService = new BookService()
        const result = await bookService.findAll({ page: page, limit: limit, name: name, user: req.user, active: active });
        return res.status(200).json(
            new ApiReponse("succes", "Find all book success", result)
        );
    } catch (error) {
        return next(error);
    }
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
        return next(error);
    }
}

export const findById = async (req, res, next) => {
    try {
        const bookService = new BookService()
        const result = await bookService.findById(req.params.id, req.user);
        return res.status(200).json(
            new ApiReponse("succes", "Find a book success", result)
        );
    } catch (error) {
        return next(error);
    }
}