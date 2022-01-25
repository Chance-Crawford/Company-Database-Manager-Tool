// npm package that displays data in a better formatted table
const cTable = require('console.table');
// connects to the MySQL database but this is the promised based
// package. so db.query will return a promise that can have a "spread"
// or a "then" function run after it.
var db = require('mysql2-promise')();

db.configure({
    "host": "localhost",
    "user": "root",
    "password": "Wc2X!cJk",
    "database": "company_manager"
});

function viewDepartments(){
    const sql = `SELECT * FROM department`;

    // made the MySQL query promise based so that we could run
    // a "then" function after this viewDepartments()
    // function returns.
    return db.query(sql).spread(rows =>{
        console.table(rows);
    });
}

function viewRoles(){
    const sql = `SELECT * FROM role`;

    // made the MySQL query promise based so that we could run
    // a "then" function after this viewDepartments()
    // function returns.
    return db.query(sql).spread(rows =>{
        console.table(rows);
    });
}

function viewEmployees(){
    const sql = `SELECT * FROM employee`;

    return db.query(sql).spread(rows =>{
        console.table(rows);
    });
}

function addDepartment(departmentObj){

    const { departmentName } = departmentObj;

    // insert new department into the database
    const sql = `INSERT INTO department(name)
                 VALUES (?)
    `;
    const params = [departmentName]

    return db.query(sql, params).spread((rows, err) =>{
        if(err){
            console.log(err);
        }
        else{
            console.log('Department Added!');
        }  
    });
}

module.exports = {
    viewDepartments, 
    viewRoles,
    viewEmployees,
    addDepartment
}