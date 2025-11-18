import Joi from 'joi'

export const authenticateSchema = Joi.object({
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