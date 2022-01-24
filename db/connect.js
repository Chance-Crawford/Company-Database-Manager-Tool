// connect to mysql database
const mysql = require('mysql2');

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Wc2X!cJk',
      database: 'company_manager'
    },
    console.log('Connected to the company_manager database.')
);

module.exports = db;