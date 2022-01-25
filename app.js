const inquirer = require('inquirer');
const { viewDepartments, viewRoles, viewEmployees, addDepartment } = require('./utils/sqlQueries');

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

    
}

// events
promptAction()
