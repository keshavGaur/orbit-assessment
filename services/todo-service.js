// const debug = require('debug')('service:logs');
const HttpError = require('standard-http-error');
const dbs = require('../db');
const errorCode = require('../errors').code;

module.exports = {
    getTodoMSSQL() {
        const query = 'SELECT TOP (10) * FROM [MembershipLogging].[dbo].[SampleTodo]';
        return dbs.mssql.getConnection()
            .then(connection => connection.request().query(query))
            .then(result => result.recordsets)
            .catch((err) => {
                throw new HttpError(HttpError.INTERNAL_SERVER_ERROR, errorCode.internal_server_error.message,
                    { stack: err, errorCode: errorCode.internal_server_error.code });
            });
    },

    getTodoMongoDB() {
        return dbs.mongodb.getConnection()
            .then(connection => connection.collection('todo').find().toArray())
            .then(result => result)
            .catch((err) => {
                throw new HttpError(HttpError.INTERNAL_SERVER_ERROR,
                    errorCode.internal_server_error.message,
                    { stack: err, errorCode: errorCode.internal_server_error.code });
            });
    },

    getTodoRedis() {
        return dbs.redis.getConnection()
            .then(connnection => new Promise((resolve) => {
                connnection.get('mysamplekey', (err, data) => {
                    if (err) {
                        throw new HttpError(HttpError.INTERNAL_SERVER_ERROR,
                            errorCode.internal_server_error.message,
                            { stack: err, errorCode: errorCode.internal_server_error.code });
                    }
                    resolve(data);
                });
            }))
            .then(result => result)
            .catch((err) => {
                throw new HttpError(HttpError.INTERNAL_SERVER_ERROR,
                    errorCode.internal_server_error.message,
                    { stack: err, errorCode: errorCode.internal_server_error.code });
            });
    },
};
