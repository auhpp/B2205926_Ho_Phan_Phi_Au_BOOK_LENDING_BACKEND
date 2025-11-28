import Joi from 'joi';
import { paginationSchema } from './commom.validation.js';

const objectId = Joi.string().hex().length(24);

export const createBookSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Tên sách không được để trống',
            'any.required': 'Tên sách là bắt buộc',
        }),
    price: Joi.number()
        .min(0)
        .required()
        .messages({
            'number.base': 'Giá phải là một con số',
            'any.required': 'Giá là bắt buộc',
        }),
    authorIds: Joi.array()
        .items(objectId.required())
        .min(1)
        .required()
        .single()
        .messages({
            'array.min': 'Phải có ít nhất 1 tác giả',
            'any.required': 'Tác giả là bắt buộc',
        }),

    categoryIds: Joi.array()
        .items(objectId.required())
        .min(1)
        .required()
        .single()
        .messages({
            'array.min': 'Phải có ít nhất 1 danh mục',
            'any.required': 'Danh mục là bắt buộc',
        }),
    publisherId: objectId
        .required()
        .messages({
            'any.required': 'Nhà xuất bản là bắt buộc',
        }),
    bookCopyQuantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.integer': 'Số lượng phải là số nguyên',
            'number.min': 'Số lượng ít nhất là 1',
            'any.required': 'Số lượng là bắt buộc',
        }),
    id: Joi.any().forbidden()
})

export const updateBookSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(3)
        .max(255)
        .messages({
            'string.empty': 'Tên sách không được để trống',
        }),
    price: Joi.number()
        .min(0)
        .messages({
            'number.base': 'Giá phải là một con số',
        }),
    authorIds: Joi.array()
        .items(objectId.required())
        .min(1)
        .single()
        .messages({
            'array.min': 'Phải có ít nhất 1 tác giả',
        }),
    images: Joi.array()
        .items(Joi.string())
        .single(),
    categoryIds: Joi.array()
        .items(objectId.required())
        .min(1)
        .single()
        .messages({
            'array.min': 'Phải có ít nhất 1 danh mục',
        }),
    publisherId: objectId,
    bookCopyQuantity: Joi.number()
        .integer()
        .min(1)
        .messages({
            'number.integer': 'Số lượng phải là số nguyên',
            'number.min': 'Số lượng ít nhất là 1',
        }),
    id: objectId,
    active: Joi.boolean()
})


export const findAllSchema = paginationSchema.append({
    name: Joi.string().trim().allow('').optional(),
    active: Joi.boolean()

})

