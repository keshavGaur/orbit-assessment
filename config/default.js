// API server default configuration
// Sensitive information will be read from process

const path = require('path');
const defer = require('config/defer').deferConfig;
const p = require('./../package.json');

const logDir = process.env.LOG_DIR || './logs';
const accessLogFileName = process.env.ACCESS_LOG_FILE_NAME || 'access.logs';
const apiLogFileName = process.env.API_LOG_FILE_NAME || 'api.logs';


// const packageVersion = p.version.split('.').shift();
module.exports = {
    app: {
        name: p.name,
        description: p.description,
    },
    api: {
        ROOT_URI: '/api',
        BASE_URI: defer(cfg => `${cfg.api.ROOT_URI}/`),
    },
    env: {
        mode: process.env.NODE_ENV || 'development',
        host: process.env.HOST || 'localhost',
        port: process.env.PORT || 3000,
    },
    db: {
        mssql: {
            user: process.env.MS_DB_USER,
            password: process.env.MS_DB_PASS,
            server: process.env.MS_DB_SERVER,
            database: process.env.MS_DB_NAME,
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000,
            },
        },
    },
    logger: {
        logDir,
        disableApiLogs: process.env.DISABLE_API_LOGS === '1',
        disableAccessLogs: process.env.DISABLE_ACCESS_LOGS === '1',
        logLevel: process.env.LOG_LEVEL || 'info',
        accessLogFileName,
        apiLogFileName,
        accessLogsRedirectToStdout: process.env.ACCESS_LOGS_REDIRECT_TO_STDOUT === '1',
        apiLogsRedirectToStdout: process.env.API_LOGS_REDIRECT_TO_STDOUT === '1',
        bunyan: {
            name: p.name,
            type: 'rotating-file',
            path: path.resolve(logDir, apiLogFileName), // log to a file
            period: '1d', // daily rotation
            count: 10,
        },
        morgan: {
            interval: '1d',
            path: logDir,
            maxFiles: 3,
        },
    },
    swagger: {
        info: {
            title: p.name,
            description: p.description,
            version: 'v1',
        },

        // Sets swagger host to either env variable (SWAGGER_URL) or local url
        host: process.env.SWAGGER_URL || defer(cfg => `${cfg.env.host}:${cfg.env.port}`),
        basePath: defer(cfg => cfg.api.BASE_URI),
        securityDefinitions: {
            Bearer: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
        security: [
            {
                Bearer: [],
            },
        ],
    },
};
