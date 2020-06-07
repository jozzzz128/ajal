const mysql = require('mysql');
const util = require('util');
const db = require('./dbinfo.json');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.database
});

pool.query = util.promisify(pool.query);
module.exports = pool;