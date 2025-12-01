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


export const sendOtpSchema = Joi.object({
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
    role: Joi.string().trim()
})

export const verifyOtpSchema = Joi.object({
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
    otp: Joi.string().trim().required()
})

export const resetPasswordSchema = Joi.object({
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
    otp: Joi.string().trim().required(),
    newPassword: Joi.string()
        .trim()
        .required()
        .messages({
            'string.empty': 'Password không được để trống',
            'any.required': 'Password là bắt buộc',
        }),
    role: Joi.string().trim()

})

export const changePasswordSchema = Joi.object({
    oldPassword: Joi.string()
        .trim()
        .required()
        .messages({
            'string.empty': 'Password không được để trống',
            'any.required': 'Password là bắt buộc',
        }),
    newPassword: Joi.string()
        .trim()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,30}$'))
        .invalid(Joi.ref('oldPassword'))
        .messages({
            'string.empty': 'Password không được để trống',
            'any.required': 'Password là bắt buộc',
        })
})