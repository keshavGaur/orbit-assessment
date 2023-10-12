const Event = require('events');
const logger = require('../../logger');

describe(
    'Test logger',
    () => {
        it(
            'Create log info',
            (done) => {
                logger.info('test log');
                done();
            },
        );
        it(
            'Create log info with empty string',
            (done) => {
                logger.info();
                done();
            },
        );
        it(
            'Create Log Session for Request',
            (done) => {
                const req = new Event();
                const res = new Event();
                logger.createLogSessionForRequest(req, res, () => {
                    done();
                });
            },
        );
    },
);
