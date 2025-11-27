import Joi from 'joi'
import { paginationSchema } from './commom.validation.js';

const objectIdRule = Joi.string().trim()
    .hex()
    .length(24)
    .messages({
        'string.base': 'ID phải là một chuỗi',
        'string.hex': 'ID phải là một chuỗi hex hợp lệ',
        'string.length': 'ID phải có đúng 24 ký tự',
        'any.required': 'ID là trường bắt buộc',
    });


export const createLoanSlipSchema = Joi.object({
    readerId: objectIdRule.required(),
    books: Joi.array()
        .items(Joi.object({
            _id: objectIdRule.required(),
            quantity: Joi.number().integer().min(1).required()
        }))
        .min(1),
    borrowedDate: Joi.date()
        .iso()
        .max('now')
        .required(),
    returnDate: Joi.date()
        .iso()
        .greater(Joi.ref('borrowedDate'))
        .required(),
    status: Joi.string().trim().required(),
    staffId: objectIdRule
})

export const updateLoanSlipSchema = Joi.object({
    status: Joi.string().trim().required(),
    staffId: objectIdRule
})

export const findAllSchema = paginationSchema.append({
    status: Joi.string().trim().allow(''),
    id: objectIdRule.allow('')
})