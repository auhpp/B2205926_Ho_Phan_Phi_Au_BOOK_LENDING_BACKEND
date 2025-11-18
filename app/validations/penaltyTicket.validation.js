import Joi from "joi";
import { paginationSchema } from "./commom.validation.js";


const objectIdRule = Joi.string().trim()
    .hex()
    .length(24)
    .messages({
        'string.base': 'ID phải là một chuỗi',
        'string.hex': 'ID phải là một chuỗi hex hợp lệ',
        'string.length': 'ID phải có đúng 24 ký tự',
        'any.required': 'ID là trường bắt buộc',
    });

export const createPenaltyTicketSchema = Joi.object({
    paymentStatus: Joi.string().trim().required(),
    typePenalty: Joi.string().trim().required(),
    amount: Joi.number()
        .min(0)
        .required(),
    createdAt: Joi.date()
        .iso()
        .required(),
    loanDetailId: objectIdRule.required(),
    staffId: objectIdRule.required(),
})

export const updatePenaltyTicketSchema = Joi.object({
    paymentStatus: Joi.string().trim().required(),
})

export const findAllSchema = paginationSchema.append({
    paymentStatus: Joi.string().trim(),
})