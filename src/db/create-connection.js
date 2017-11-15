const mysql = require('mysql2/promise')

module.exports = () => mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || 'root',
    database: process.env.MYSQL_DB || 'myhn',
    port: process.env.MYSQL_PORT || 7853
})
