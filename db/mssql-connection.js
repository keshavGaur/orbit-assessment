
const sql = require('mssql');
const debug = require('debug')('MSSql');
const config = require('config');

let mssqlSingletonConnection = null;

/**
 * establish mssql connection and return singleton connection obj
 * @returns {Object} mssql connection object
 */
async function getConnection() {
    if (mssqlSingletonConnection && mssqlSingletonConnection.connected) {
        return mssqlSingletonConnection;
    }
    debug('Connecting to MSSQL server');
    mssqlSingletonConnection = await new sql.ConnectionPool(config.get('db').mssql).connect();
    debug('Connected to MSSQL server');
    mssqlSingletonConnection.on('error', (err) => {
        console.log(err);
    });
    return mssqlSingletonConnection;
}

module.exports = {
    getConnection,
};
// SQL error handler
sql.on('error', (err) => {
    console.log('Error in connecting sql server', err);
});
