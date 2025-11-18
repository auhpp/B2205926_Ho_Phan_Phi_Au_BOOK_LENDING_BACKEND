import Joi from 'joi'

const objectIdRule = Joi.string()
    .trim()
    .hex()
    .length(24)
    .messages({
        'string.base': 'ID phải là một chuỗi',
        'string.hex': 'ID phải là một chuỗi hex hợp lệ',
        'string.length': 'ID phải có đúng 24 ký tự',
        'any.required': 'ID là trường bắt buộc',
    });

export const idSchema = Joi.object({
    id: objectIdRule.required(),
});


export const paginationSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10),
})

export const findByNameShema = Joi.object({
    name: Joi.string()
        .trim()
        .required()
})