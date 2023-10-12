#!/usr/bin/env node

/**
 * Module dependencies.
 */

const debug = require('debug')('enterpriseapi:server');
require('dotenv').config();
const http = require('http');
const config = require('config');
const packageJ = require('../package.json');
const appRouter = require('./router');
const logger = require('../logger');


/**
 * Create an HTTP server which uses the supplied router
 * @param {Object} router Express router
 * @returns {Object} httpServer
 */
function createServer(router) {
    const result = http.createServer(router);
    return result;
}

/**
 * Create a request router using ... journey, express, other, ...
 * pass router options as needed
 * @returns {Object} expressRouter
 */
function createRouter() {
    const result = appRouter();
    return result;
}

/**
 * How to handle the 'listen' event
 * @returns {void}
 */
function serverListenHandler() {
    console.log(`${process.title}: listening`);
    logger.info(`${process.title}: listening`);
    // console.log('Server address:', server.address().address, server.address().port);
}

/**
 * How to handle the 'error'; event
 * @param {Object} error error event object
 * @returns {void}
 */
function serverErrorHandler(error) {
    if (error.code === 'EACCES') {
        debug(`${process.title}: requires elevated privileges, ${error.message}`);
    } else if (error.code === 'EADDRINUSE') {
        debug(`${process.title}: address in use, ${error.message}, retrying in 1 second...`);
    } else {
        throw error;
    }
}
/**
 * Start the server on specific port
 * @param  {Number} port server listening port
 * @returns {Object} http server
 */
function startServer(port) {
    const router = createRouter();
    const server = createServer(router);
    if (port) {
        server.listen(port);
        logger.info('PORT: ', port);
        console.log('PORT: ', port);
        // When the server is ready and listening let the log know
        server.on('listening', serverListenHandler);
        // How to handle some errors
        server.on('error', (error) => {
            serverErrorHandler(error);
            server.close();
            process.exit(1);
        });
    }
    return server;
}

/** Normalize a port into a number, string, or false.
 * @param  {Number} fpPort port to run server
 * @returns {Number} port on which server will listen
 */
function normalizePort(fpPort) {
    let resultPort = parseInt(fpPort, 10);

    if (Number.isNaN(resultPort)) {
        // By rule a string input is a named pipe
        resultPort = fpPort;
    }

    if (resultPort < 0) {
        // By rule a negative port value returns false
        resultPort = false;
    }

    return resultPort;
}

/**
 * Start a web service on the port configured from the environment variable or default
 *  to 3000
 * @returns {void}
 */
function main() {
    const env = config.get('env');
    /**
     * Get port from environment.
     */
    const port = normalizePort(process.env.PORT || env.port || 3000);
    // Tag the process by saetting its title to the package name
    process.title = packageJ.name;

    // Start the web service to listen for commands
    const webService = startServer(port);

    process.on('uncaughtException', async (err) => {
        // bonus: log the exception
        await logger.logUncaughtException(err);
        process.exit(1);
    });

    return webService;
}

module.exports = {
    main,
    normalizePort,
    startServer,
    createRouter,
    createServer,
    serverListenHandler,
    serverErrorHandler,
};
