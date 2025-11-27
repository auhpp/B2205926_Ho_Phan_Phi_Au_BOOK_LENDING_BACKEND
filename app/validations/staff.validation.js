import Joi from 'joi'
import { paginationSchema } from './commom.validation.js'

export const createStaffSchema = Joi.object({
    userName: Joi.string()
        .trim()
        .min(3)
        .max(30)
        .alphanum()
        .required()
        .messages({
            'string.empty': 'Username không được để trống',
            'any.required': 'Username là bắt buộc',
        }),
    password: Joi.string()
        .trim()
        .required()
        .messages({
            'string.empty': 'Password không được để trống',
            'any.required': 'Password là bắt buộc',
        }),
})

export const updateStaffSchema = Joi.object({
    active: Joi.boolean().required()
})


export const findAllSchema = paginationSchema.append({
    userName: Joi.string().trim().allow('').optional()
})