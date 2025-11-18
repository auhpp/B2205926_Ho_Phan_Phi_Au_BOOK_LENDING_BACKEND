import Joi from 'joi'

const objectIdRule = Joi.string()
    .hex()
    .length(24)
    .messages({
        'string.base': 'ID phải là một chuỗi',
        'string.hex': 'ID phải là một chuỗi hex hợp lệ',
        'string.length': 'ID phải có đúng 24 ký tự',
        'any.required': 'ID là trường bắt buộc',
    });

export const updateLoanDetailSchema = Joi.object({
    status: Joi.string().required(),
    bookCopyId: objectIdRule.required(),
    loanSlipId: objectIdRule.required(),
})