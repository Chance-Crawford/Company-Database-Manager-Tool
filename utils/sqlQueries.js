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

    // expecting an object from inquirer.prompt
    // takes object and destructures it to get
    // the name of the department.
    const { departmentName } = departmentObj;

    // insert new department into the database
    const sql = `INSERT INTO department(name)
                 VALUES (?)
    `;
    const params = [departmentName]

    return db.query(sql, params).spread((rows, err) =>{
        if(err){
            console.log('Failed to add department to database, please try again');
        }
        else{
            console.log('Department Added!');
        }  
    });
}

async function addRole(roleObj){

    // expecting an object from inquirer.prompt
    // takes object and destructures it to get
    // the name of the role.
    const { title, salary, departmentName } = roleObj;
    
    let department_id;

    // created a function within a function so that the 
    // id number can be returned from the async database 
    // call. and then a "then" statement can be used below
    // to pass the id into the other database call successfully.
    function getDepartmentId(){
        // get id of department based on name from user
        const departmentSql = `SELECT id FROM department WHERE name= (?)`;
        const departmentParam = [departmentName];


        return db.query(departmentSql, departmentParam).spread(row =>{
            // finds the id of the name that the user entered
            // and the extracts the id value from the object that
            // was returned from the database.
            // then assigns it to department_id variable
            department_id = row[0].id;
        });
    }
    
    // get the id, function above, then insert the role with the 
    // department_id into the database
    return getDepartmentId()
    .then(()=>{
        // insert new role into the database
        const sql = `INSERT INTO role(title, salary, department_id)
                     VALUES (?, ?, ?)
        `;
        // these are the names I gave to the properties of the
        // inquirer object.
        const params = [title, salary, department_id];

        // return the query response info to check the affectedRows
        // in a "then" statement in app.js.
        // this is done so that the "role added" message
        // does not appear after the new selection menu
        // and is synchronous
        return db.query(sql, params);
    }) 
}

module.exports = {
    viewDepartments, 
    viewRoles,
    viewEmployees,
    addDepartment, 
    addRole
}