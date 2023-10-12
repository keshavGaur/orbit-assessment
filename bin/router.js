const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');
const configureVersion = require('version-healthcheck').configure;
const headerValidator = require('../validation-middleware/header');
const errorHandler = require('../errors').handler;
const swagger = require('./swagger');
const logger = require('../logger');
const routes = require('../routes');

const version = configureVersion({
    callback: function customVersion(req, res) {
        // `this` is the version response. It will already contain
        // the default values.

        // Anything you do with `this` will change the JSON response.
        // this.foo = 'npm bar';
        // You can also access the request and response objects.
        // this.url = req.url
    },
    buildPath: '/BUILD', // path is relative to the app directory.
});
/** create express app and mount all routes
 * @returns {Object} Express app instance
 */
function myRouter() {
    const router = express();
    router.use(bodyParser.json());
    router.use(bodyParser.urlencoded({ extended: false }));
    router.use(headerValidator.getRequestId);
    router.use(logger.createLogSessionForRequest);
    logger.setupAccessLogForRequest(router);
    router.use(config.get('api.BASE_URI'), routes);
    // Setup version endpoint to access application version & build information
    router.get('/version', version);

    if (config.get('env.mode') === 'development' || config.get('env.mode') === 'test') {
        // Serve swagger specification as json
        router.get('/swagger.json', swagger.load());
        // Swagger-UI endpoint
        router.use('/docs', express.static('public/swagger-ui'));
    }

    // 404 handler
    router.use(errorHandler.notFoundError());
    // Other error handler
    router.use(errorHandler.httpError());

    return router;
}
module.exports = myRouter;
