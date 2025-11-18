import Joi from 'joi'
import { paginationSchema } from './commom.validation.js';

const objectIdRule = Joi.string()
    .hex()
    .length(24)
    .messages({
        'string.base': 'ID phải là một chuỗi',
        'string.hex': 'ID phải là một chuỗi hex hợp lệ',
        'string.length': 'ID phải có đúng 24 ký tự',
        'any.required': 'ID là trường bắt buộc',
    });

export const createBookCopySchema = Joi.object({
    bookId: objectIdRule.required(),
    quantity: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .required(),
    status: Joi.string()
        .trim()
        .required()
})

export const updateCopySchema = Joi.object({
    bookId: objectIdRule,
    quantity: Joi.number()
        .integer()
        .min(1)
        .default(1),
    status: Joi.string()
        .trim()
})

export const findByBookIdSchema = paginationSchema.append({
    bookId: objectIdRule.required(),
    status: Joi.string()
})