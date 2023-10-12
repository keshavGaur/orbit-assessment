const bunyan = require('bunyan'); // API Logging
const morgan = require('morgan'); // Access Logging
const fs = require('fs');
const mformat = require('morgan-json');
const cls = require('continuation-local-storage');
const rfs = require('rotating-file-stream');

const logConf = require('config').get('logger');
const constants = require('../helpers/constants');
const { BunyanStreamInterceptor } = require('../helpers/interceptors');

const appLogConf = logConf.bunyan;
const accessLogConf = logConf.morgan;

const loggerSession = cls.createNamespace(appLogConf.name);

const morganString = mformat({
    'remote-addr': ':remote-addr',
    'remote-user': ':remote-user',
    logTime: '[:date[clf]]',
    method: ':method',
    url: ':url',
    'http-version': ':http-version',
    status: ':status',
    res: ':res[content-length]',
    referrer: ':referrer',
    'user-agent': ':user-agent',
    req: `:req[${constants.X_REQUEST_ID_HEADER}]`,
    appCode: 'enterprise-microservice-template',
});

const { logDir } = logConf;

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}
const accessLogStream = logConf.accessLogsRedirectToStdout
    ? process.stdout : rfs(logConf.accessLogFileName, accessLogConf);
const bunyanStream = logConf.apiLogsRedirectToStdout
    ? process.stdout : new bunyan.RotatingFileStream(appLogConf);

const internalLogger = bunyan.createLogger({
    name: appLogConf.name,
    level: logConf.logLevel,
    streams: [
        {
            type: 'raw',
            stream: new BunyanStreamInterceptor(bunyanStream),
        },
    ],
});

/**
 * Function to get request id from current context
 *
 * @returns {String} request id / null if context dosen't exist
 */
function getReqId() {
    return loggerSession.get('reqId') || undefined;
}

/**
 * Object to be used for logging
 * @returns {void}
 */
function Logger() { }


Object.keys(bunyan.levelFromName).forEach((name) => {
    Logger.prototype[name] = function getFunc(error, ...any) {
        if (logConf.disableApiLogs) return function noLogging() { };
        if (!error) return internalLogger[name]();
        return internalLogger[name]({ req: getReqId() }, error, ...any);
    };
});


Logger.prototype.createLogSessionForRequest = function createLogSessionForRequest(req, res, next) {
    loggerSession.bindEmitter(req);
    loggerSession.run(() => {
        loggerSession.set('reqId', req && req.headers ? req.headers[constants.X_REQUEST_ID_HEADER] : undefined);
        next();
    });
};


Logger.prototype.setupAccessLogForRequest = function setupAccessLogger(app) {
    if (logConf.disableAccessLogs) return;
    app.use(morgan(morganString, {
        stream: accessLogStream,
    }));
};

Logger.prototype.logUncaughtException = function handleUncaughtException(err) {
    return new Promise((resolve, reject) => {
        const stream = bunyanStream.stream || bunyanStream;
        this.fatal(err);
        if (typeof (stream) !== 'object') return;
        // throw the original exception once stream is closed
        stream.on('finish', () => {
            resolve();
        });
        // close stream, flush buffer to disk
        stream.end();
    });
};

module.exports = new Logger();
