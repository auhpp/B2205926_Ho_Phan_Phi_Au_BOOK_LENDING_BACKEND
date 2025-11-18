const validate = (schema, location) => {
    return (req, res, next) => {
        const dataToValidate = req[location]

        const options = {
            abortEarly: false,
            stripUnknown: true
        }

        const { error, value } = schema.validate(dataToValidate, options)
        if (error) {
            const errorMessages = error.details.map((detail) => detail.message);
            return res.status(400).json({
                statusCode: 400,
                message: 'Dữ liệu không hợp lệ',
                errors: errorMessages,
            });
        }
        if (req[location]) {
            for (const key in req[location]) {
                delete req[location][key];
            }
        }
        Object.assign(req[location], value);
        return next()
    }
}

export default validate;