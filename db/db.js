const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '990327',
    database: 'dinothing'
});

module.exports = pool;