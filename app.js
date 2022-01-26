const inquirer = require('inquirer');
const { viewDepartments, viewRoles, getEmployeeObjects, viewEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole } = require('./utils/sqlQueries');

function promptAction(){
    // After user chooses their desired option from the list.
    // returns an object like this { choice: 'View all employees' }
    return inquirer.prompt([
        {
            type: 'list',
            pageSize: 8,
            message: 'Please choose an action:',
            name: 'choice',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'QUIT']
        },
    ])
    .then(performAction);
}

function performAction(choiceObj){
    // destructure object for choice property
    const { choice } = choiceObj;

    if(choice === 'QUIT'){
        // ends application
        process.exit()
    }

    if(choice === 'View all departments'){
        // shows that department data in a table and then
        // prompts the user to choose a different action.
        return viewDepartments().then(promptAction);
    }

    if(choice === 'View all roles'){
        // shows that department data in a table and then
        // prompts the user to choose a different action.
        return viewRoles().then(promptAction);
    }

    if(choice === 'View all employees'){
        return viewEmployees().then(promptAction);
    }

    // conditional for adding a department
    if(choice === 'Add a department'){

        // prompts for name, then adds department, then 
        // asks user if there is another action they would
        // like to take.
        return inquirer.prompt({
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?',
            validate: nameInput =>{
                if(nameInput){
                return true;
                }
                else{
                console.log("Please enter the department's name");
                return false;
                }
            }
        })
        .then(addDepartment)
        .then(promptAction);
    }

    // conditional for adding a role
    if(choice === 'Add a role'){

        // prompts for info, then adds role to database, then 
        // asks user if there is another action they would
        // like to take.
        return inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role?',
                validate: input =>{
                    if(input){
                    return true;
                    }
                    else{
                    console.log("Please enter the name of the role");
                    return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?',
                validate: input =>{
                    if(input){
                    return true;
                    }
                    else{
                    console.log("Please enter the salary of the role");
                    return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'departmentName',
                message: 'Which department does the role belong to?',
                validate: input =>{
                    if(input){
                    return true;
                    }
                    else{
                    console.log("Please enter the department that the role belongs to");
                    return false;
                    }
                }
            }
        ])
        .then(addRole)
        // based on whether a row was added
        // to the database, return a success or
        // error message
        .then((queryInfo)=>{
            if(queryInfo[0].affectedRows === 1){
                console.log('Role added to database');
            }
            else{
                console.log('Failed to add role to database, please try again');
            }
        })
        .then(promptAction);
    }

    // conditional for adding an employee
    if(choice === 'Add an employee'){

        // prompts for info, then adds employee to database, then 
        // asks user if there is another action they would
        // like to take.
        return inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: input =>{
                    if(input){
                    return true;
                    }
                    else{
                    console.log("Please enter the employee's first name");
                    return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: input =>{
                    if(input){
                    return true;
                    }
                    else{
                    console.log("Please enter the employee's last name");
                    return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'employeeRole',
                message: "What is the employee's role?",
                validate: input =>{
                    if(input){
                    return true;
                    }
                    else{
                    console.log("Please enter the employee's role");
                    return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'manager',
                message: "Please enter the ID of the employee's manager. (Press enter if the employee does not have a manager)"
            }
        ])
        .then(addEmployee)
        // based on whether a row was added
        // to the database, return a success or
        // error message
        .then((queryInfo)=>{
            if(queryInfo[0].affectedRows === 1){
                console.log('Employee added to database');
            }
            else{
                console.log('Failed to add employee to database, please try again');
            }
        })
        .then(promptAction);
    }

    if(choice === 'Update an employee role'){

        // returns an array of the employees from the database
        // so the array can then be added to the choices field
        // of the inquirer.prompt list
        getEmployeeObjects()
        .then(arr =>{
            return inquirer.prompt([
                {
                    type: 'list',
                    pageSize: 8,
                    message: 'Which employee role do you want to update:',
                    name: 'employeeName',
                    choices: arr
                },
                {
                    type: 'input',
                    name: 'newRole',
                    message: "What is the employee's new role?",
                    validate: input =>{
                        if(input){
                        return true;
                        }
                        else{
                        console.log("Please enter the employee's new role");
                        return false;
                        }
                    }
                }
            ]);
        })
        .then(updateEmployeeRole)
        // based on whether a row was updated
        // in the database, return a success or
        // error message
        .then((queryInfo)=>{
            if(queryInfo[0].affectedRows === 1){
                console.log('Employee role updated');
            }
            else{
                console.log('Failed to update employee role, please try again');
            }
        })
        .then(promptAction);
        
    }

    
}

// events
promptAction()
