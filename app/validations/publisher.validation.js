import Joi from 'joi'
import { paginationSchema } from './commom.validation.js'

export const createPublisherSchema = Joi.object({
    name: Joi.string()
        .trim()
        .max(256)
        .required()
        .messages({
            "string.empty": "Tên không được rỗng",
            "any.required": "Tên là giá trị bắt buộc"
        })
})

export const updatePublisherSchema = Joi.object({
    name: Joi.string()
        .trim()
        .max(256)
        .messages({
            "string.empty": "Tên không được rỗng",
            "any.required": "Tên là giá trị bắt buộc"
        }),
})

export const findAllSchema = paginationSchema.append({
    name: Joi.string().trim().allow('').optional()
})