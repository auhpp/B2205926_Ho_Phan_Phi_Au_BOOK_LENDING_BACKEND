import ApiReponse from "../dto/response/api.response.js";
import ReaderService from "../services/reader.service.js";

export const create = async (req, res, next) => {
    try {
        const readerService = new ReaderService();
        const newReader = await readerService.create({ userName: req.body.userName, password: req.body.password });
        return res.status(201).json(
            new ApiReponse("succes", "Create a reader success", newReader)
        );
    } catch (error) {
        return next(error)
    }
}


export const update = async (req, res, next) => {
    try {
        const userData = req.body;
        const avatarFile = req.file;
        const currentUser = req.user;
        const readerService = new ReaderService();
        const newReader = await readerService.updateInfo({ _id: req.params.id, ...userData }, avatarFile, currentUser);
        return res.status(201).json(
            new ApiReponse("succes", "Create a reader success", newReader)
        );
    } catch (error) {
        return next(error)
    }
}

export const updateStatus = async (req, res, next) => {
    try {
        const active = req.body.active;
        const readerService = new ReaderService();
        const newReader = await readerService.updateStatus({ _id: req.params.id, active: active })
        return res.status(201).json(
            new ApiReponse("succes", "Update status a reader success", newReader)
        );
    } catch (error) {
        return next(error)
    }
}


export const findPagination = async (req, res, next) => {
    try {
        var readers = [];
        const readerService = new ReaderService();
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const userName = req.query.userName;
        const active = req.query.active;
        readers = await readerService.findPagination({ page: page, limit: limit, userName: userName, active: active });
        return res.status(200).json(
            new ApiReponse("succes", "Find pagination reader success", readers)
        );
    } catch (error) {
        return next(error)
    }
}
