// using config to manage and change config acc to env
const config = require('config');
const pg = require('pg');

const dbconfig = config.get('db.pg');

var pool = new pg.Pool(dbconfig);

// return connection
module.exports = pool;