import express from "express";
import * as authorController from "./../controllers/author.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { idSchema } from "../validations/commom.validation.js";
import { createAuthorSchema, findAllSchema, updateAuthorSchema } from "../validations/author.validation.js";

const router = express.Router();

router.use(authMiddleware);

router.route("/")
    .post(validate(createAuthorSchema, "body"), authorController.create)
    .get(validate(findAllSchema, "query"), authorController.findPagination)

router.route("/all")
    .get(authorController.findAll)

router.route("/:id")
    .delete(validate(idSchema, "params"), authorController.deleteAuthor)
    .put(validate(idSchema, "params"), validate(updateAuthorSchema, "body"), authorController.update)

export default router;