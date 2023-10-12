const Joi = require('joi');

module.exports = {
    options: {
        // flatten: true,
        status: 422,
        statusText: 'Unprocessable Entity',
    },
    body: {
        username: [
            Joi.string().email().min(8).max(100)
                .required(),
            Joi.string().regex(/^[789]\d{9}$/).length(10).required(),
        ],
    },
};
