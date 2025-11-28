import Joi from 'joi'
import { paginationSchema } from './commom.validation.js'

export const createReaderSchema = Joi.object({
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


export const updateReaderSchema = Joi.object({
    active: Joi.boolean(),
    fullName: Joi.string().trim().max(256),
    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .messages({
            'string.email': 'Email không hợp lệ',
        }),
    phoneNumber: Joi.string()
        .trim()
        .pattern(new RegExp(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/))
        .messages({
            'string.pattern.base': 'Số điện thoại phải bao gồm 10 chữ số',
        }),
    gender: Joi.string().trim(),
    dateOfBirth: Joi.date().iso(),
})

export const findAllSchema = paginationSchema.append({
    userName: Joi.string().trim().allow('').optional(),
    active: Joi.boolean()

})