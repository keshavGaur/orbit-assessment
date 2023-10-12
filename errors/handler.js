const ev = require('express-validation');
const HttpError = require('standard-http-error');
const logger = require('../logger');
const errorCodes = require('./code');

/**
 * this function transform a JOI error response into API error response
 * @param {Array} fields - Array of keys
 * @param {Object} errorDetail - errorDetail object
 * @param {Array} messages - array of error message string
 * @returns {void} appends field error detail to errorDetail
 */
function addFieldErrorDetail(fields, errorDetail, messages) {
    const errorFieldDetail = errorDetail;
    if (!(fields && fields.length)) {
        return;
    }
    const field = fields.shift();
    if (!errorFieldDetail[field]) errorFieldDetail[field] = {};
    if (!fields.length) {
        errorFieldDetail[field] = messages.join(',');
    }
    addFieldErrorDetail(fields, errorFieldDetail[field], messages);
}

/**
 * this function transform a JOI error response into API error response
 * @param {Error} validationError - JOI error object
 * @returns {Object} error - API error response generated from array of validation errors
 */
function generateErrorResponse(validationError) {
    const error = {};
    error.errorCode = validationError.statusText.code;
    error.message = validationError.statusText.message;
    error.details = {};
    if (validationError.errors && validationError.errors.length) {
        const errorDetails = error.details;
        validationError.errors.forEach((err) => {
            if (!errorDetails[err.location]) {
                errorDetails[err.location] = {};
            }
            addFieldErrorDetail(err.field, errorDetails[err.location], err.messages);
        });
        if (errorDetails.headers != null) {
            error.errorCode = errorCodes.NOT_ACCEPTABLE.code;
            error.message = errorCodes.NOT_ACCEPTABLE.message;
        }
    }
    return error;
}

/**
 * Returns the 404 handler function
 * @returns {Function} express route handler for forwarding error
 */
function notFoundError() {
    return (req, res, next) => {
        const err = new HttpError(HttpError.NOT_FOUND, errorCodes.NOT_FOUND.message, {
            stack: null,
            errorCode: errorCodes.NOT_FOUND.code,
        });
        next(err);
    };
}
/**
 * Return the generic error handler function
 * @returns {Function} express error handler
 */
function httpError() {
    return (err, req, res, next) => {
        let statusCode = err.code || err.status || 500;
        let error;
        if (err instanceof ev.ValidationError) {
            error = generateErrorResponse(err);
            if (error.errorCode === errorCodes.NOT_ACCEPTABLE.code) {
                statusCode = HttpError.NOT_ACCEPTABLE;
            }
        } else if (err instanceof SyntaxError) {
            logger.error(err);
            error = {
                errorCode: errorCodes.INVALID_INPUT.code,
                message: errorCodes.INVALID_INPUT.message,
            };
            if (err.stack != null && req.app.get('env') === 'development') {
                error.stack = err.stack;
            }
        } else {
            if (!(err instanceof HttpError)) {
                logger.error(err);
                statusCode = HttpError.INTERNAL_SERVER_ERROR;
            }
            error = {
                errorCode: err.errorCode || errorCodes.INTERNAL_SERVER_ERROR.code,
                message: err.message || errorCodes.INTERNAL_SERVER_ERROR.message,
            };
            if (err.stack != null && req.app.get('env') === 'development') {
                error.stack = err.stack;
            }
        }
        error.details = error.details || err.details || {};
        res.status(statusCode);
        res.json(error);
    };
}

module.exports = {
    notFoundError,
    httpError,
};
