
const mssql = require('./mssql-connection');

const dbs = {
    mssql: {
        getConnection: () => mssql.getConnection(),
    },
};

module.exports = dbs;
