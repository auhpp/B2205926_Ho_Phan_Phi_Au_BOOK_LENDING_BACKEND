import Joi from 'joi'
import { paginationSchema } from './commom.validation.js'

export const updateConfigurationSchema = Joi.object({
    value: Joi.number()
        .integer()
        .min(1)
    , unit: Joi.string()
        .trim()
        .max(256)
})

export const findAllSchema = paginationSchema.append({
    name: Joi.string().trim().allow('').optional()
})