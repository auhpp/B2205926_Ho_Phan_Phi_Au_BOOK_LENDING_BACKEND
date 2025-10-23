import ApiReponse from "../dto/response/api.response.js";
import BookService from "../services/book.service.js";

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
        console.error('Error creating book:', error.message);
    }
}