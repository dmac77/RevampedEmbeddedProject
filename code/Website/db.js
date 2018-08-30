let pg = require('pg');
let constants = require('./constants');

let db = new pg.Client({
    host: constants.DBHost,
    user: constants.DBUser,
    password: constants.DBPassword,
    database: constants.DBName,
    port: 5432,
    ssl: false,
    statement_timeout: 5000
});

db.connect((err) => {
    if (err) {
        console.log(err);
    }
});

module.exports = db;