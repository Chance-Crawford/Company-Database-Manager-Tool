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
    const sql = `SELECT role.*, department.name AS department
                 FROM role
                 LEFT JOIN department ON role.department_id = department.id
                 
    `;

    // made the MySQL query promise based so that we could run
    // a "then" function after this viewDepartments()
    // function returns.
    return db.query(sql).spread(rows =>{
        console.table(rows);
    });
}

function viewEmployees(){

    // select all columns from employee table except for role_id column,
    // select the title and salary columns from the role table
    // (and give them aliases in the new table we are displaying),
    // then select the name column from the department table.

    // left join will join all specified columns onto the table
    // specified in the FROM command.

    // left join role will match the employee.role_id column
    // to the id of the role in the role table and merge them
    // together. Saying left join role only joins the columns
    // specified in the role select statement, in this case
    // title and salary from the role table will be joined.

    // we want to join the department.name column when we match
    // the role_id to the employee role id. Since the role
    // table contains the foreign key to determine which department
    // the role belongs to (the department_id column in the role table)
    // we need to match up the role id to the employees role id first
    // and then select that same role, and get its department_id.
    // that way we can be sure the employee's role is being matched to
    // the correct department.
    const sql = `
                 SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, role.title AS role, role.salary AS salary, department.name AS employee_department
                 FROM employee 
                 LEFT JOIN role ON employee.role_id = role.id      
                 LEFT JOIN department ON employee.role_id = role.id WHERE role.department_id = department.id     
    `;

    return db.query(sql).spread(rows =>{
        console.table(rows);
    });
}

// returns an array of the employees from the database
// so the array can then be added to the choices field
// of the inquirer.prompt list
function getEmployeeObjects(){
    let employeeArr = [];
    const sql = `SELECT * FROM employee`;

    return db.query(sql).spread(rows =>{
        for(let i = 0; i < rows.length; i++){
            let name;
            
            name = `${rows[i].first_name} ${rows[i].last_name}`;

            employeeArr.push(name);
        }

        return employeeArr;
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

function addRole(roleObj){

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
            // and then extracts the id value from the object that
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

function addEmployee(employeeObj){

    // expecting an object from inquirer.prompt
    // takes object and destructures it to get
    // the info to put in the database.
    const { firstName, lastName, employeeRole, manager } = employeeObj;
    
    let role_id;

    // turn into a number
    let manager_id = Number(manager);

    // if user didnt assign a manager, then 0 will be returned
    // by inquirer once manager_id tried to parse it to a number.
    // so if the variable is less than one, just set it to null.
    if(manager_id < 1){
        manager_id = null;
    }

    // created a function within a function so that the 
    // id number can be returned from the async database 
    // call. and then a "then" statement can be used below
    // to pass the id into the other database call successfully.
    function getEmployeeId(){
        // get id of role based on title from user
        const employeeSql = `SELECT id FROM role WHERE title= (?)`;
        const employeeParam = [employeeRole];


        return db.query(employeeSql, employeeParam).spread(row =>{
            // finds the id of the role that the user entered
            // and then extracts the id value from the object that
            // was returned from the database.
            // then assigns it to role_id variable
            role_id = row[0].id;
        });
    }
    
    // get the id, function above, then insert the employee with the 
    // role_id into the database
    return getEmployeeId()
    .then(()=>{
        // insert new employee into the database
        const sql = `INSERT INTO employee(first_name, last_name, role_id, manager_id)
                     VALUES (?, ?, ?, ?)
        `;
        // these are the names I gave to the properties of the
        // inquirer object.
        const params = [firstName, lastName, role_id, manager_id];

        // return the query response info to check the affectedRows
        // in a "then" statement in app.js.
        // this is done so that the "role added" message
        // does not appear after the new selection menu
        // and is synchronous
        return db.query(sql, params);
    }) 
}

function updateEmployeeRole(roleObj){
    const { employeeName, newRole } = roleObj;

    const employeeFirst = employeeName.split(' ')[0];
    const employeeLast = employeeName.split(' ')[1];

    let role_id;

    function getRoleId(){
        // get id of new role based on title from user
        const roleSql = `SELECT id FROM role WHERE title= (?)`;
        const roleParam = [newRole];


        return db.query(roleSql, roleParam).spread(row =>{
            // finds the id of the role that the user entered
            // and then extracts the id value from the object that
            // was returned from the database.
            // then assigns it to role_id variable
            role_id = row[0].id;
        });
    }

    return getRoleId()
    .then(() =>{
        const sql = `UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`;
        const params = [role_id, employeeFirst, employeeLast]

        return db.query(sql, params)
    });
    
}


module.exports = {
    viewDepartments, 
    viewRoles,
    getEmployeeObjects,
    viewEmployees,
    addDepartment, 
    addRole,
    addEmployee,
    updateEmployeeRole
}