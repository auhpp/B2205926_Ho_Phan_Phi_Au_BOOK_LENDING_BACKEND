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
