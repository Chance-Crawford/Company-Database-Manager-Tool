const inquirer = require('inquirer');
const { viewDepartments } = require('./utils/sqlQueries');

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
    const { choice } = choiceObj

    if(choice === 'View all departments'){
        return viewDepartments().then(promptAction);
    }

    if(choice === 'QUIT'){
        process.exit()
    }
}

// events
promptAction()
