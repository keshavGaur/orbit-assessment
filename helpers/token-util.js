

const HttpError = require('standard-http-error');

/**
 * parse
 * @param {String} token auth token.
 * @returns {String} Matched token.
 */
function parseToken(token) {
    const matches = token.match(/(Bearer|Basic)\s(\S+)/);
    if (!matches) {
        throw new HttpError(422, 'Unprocessable entity.', { stack: 'Incorrect token.' });
    }
    return matches[0];
}

module.exports = {
    getAuthorizationTokenFromRequest(request) {
        if (!request || !request.headers || !request.headers.authorization) {
            throw new HttpError(422, 'Unprocessable entity.', { stack: 'Authorization header is required.' });
        }
        return parseToken(request.headers.authorization);
    },
};
