
const uuid = require('uuid/v1');
const constants = require('../helpers/constants');
/*
    This module will perform operation around x-request-id header
*/

module.exports = {
    generateRequestIdIfNotExist(request) {
        if (!request.headers[constants.X_REQUEST_ID_HEADER]
            || request.headers[constants.X_REQUEST_ID_HEADER].trim() === '') {
            request.headers[constants.X_REQUEST_ID_HEADER] = uuid();
        }
    },
};
