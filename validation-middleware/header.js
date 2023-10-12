
const tokenUtil = require('../helpers/token-util');
const requestId = require('../helpers/request-id');

module.exports = {
    authenticate(req, res, next) {
        // this method return token which can be further validated as per need
        tokenUtil.getAuthorizationTokenFromRequest(req);
        next();
    },
    getRequestId(req, res, next) {
        requestId.generateRequestIdIfNotExist(req);
        next();
    },
};
