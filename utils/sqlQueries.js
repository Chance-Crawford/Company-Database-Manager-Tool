// npm package that displays data in a better formatted table
const cTable = require('console.table');
// connects to the MySQL database but this is the promised based
// package. so db.query will return a promise that can have a "then"
// function run after it
var db = require('mysql2-promise')();

db.configure({
    "host": "localhost",
    "user": "root",
    "password": "Wc2X!cJk",
    "database": "company_manager"
});

function viewDepartments(){
    const sql = `SELECT * FROM department`;

    return db.query(sql).spread(rows =>{
        console.table(rows);
    });
}

module.exports = {
    viewDepartments
}