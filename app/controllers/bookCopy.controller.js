import ApiReponse from "../dto/response/api.response.js";
import BookCopyService from "../services/bookCopy.service.js";

export const create = async (req, res, next) => {
    const bookCopyService = new BookCopyService()
    const author = await bookCopyService.create(req.body);
    return res.status(200).json(
        new ApiReponse("succes", "Create a author success", author)
    );
}


export const findAll = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const bookCopyService = new BookCopyService()
    const result = await bookCopyService.findAll({ page: page, limit: limit });
    return res.status(200).json(
        new ApiReponse("succes", "Find all book copy success", result)
    );
}

