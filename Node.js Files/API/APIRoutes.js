var mysql = require('mysql2');
var jwt     = require('jsonwebtoken');
var secret = require('../config').secret;
var config =
{
    connectionLimit: 25,
    host: 'studentmysql.mysql.database.azure.com',
    user: 'bjones325@studentmysql',
    password: 'Catkid1541$',
    database: 'fitsyque',
    port: 3306,
    ssl: false
};


var pool = mysql.createPool(config);

var conn = function (callItem) {
  pool.getConnection(function(err, connection) {
    if (err) {
        console.log(err);
    } else {
        callItem(connection);
    }
  });
};

function sanitizeInput(input) {
    if (!input
        || input.includes('“')
        || input.includes("'")
        || input.includes("'")
        || input.includes("‘")
        || input.includes('"')) {
        return null;
    }
    return input;
}

module.exports = {
  conn: conn,
  clean: sanitizeInput
};