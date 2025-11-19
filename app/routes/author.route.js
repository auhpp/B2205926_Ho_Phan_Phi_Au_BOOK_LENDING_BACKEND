import express from "express";
import * as authorController from "./../controllers/author.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import { createAuthorSchema, findAllSchema, updateAuthorSchema } from "../validations/author.validation.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(authorize('admin'), validate(createAuthorSchema, "body"), authorController.create)
    .get(authorize('admin'), validate(findAllSchema, "query"), authorController.findPagination)

router.route("/all")
    .get(authorize('admin'), authorController.findAll)

router.route("/:id")
    .delete(authorize('admin'), validate(idSchema, "params"), authorController.deleteAuthor)
    .put(authorize('admin'), validate(idSchema, "params"), validate(updateAuthorSchema, "body"), authorController.update)

export default router;