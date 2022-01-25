const inquirer = require('inquirer');

function promptAction(){
    // After user chooses their desired option from the list.
    // returns an object like this { choice: 'View all employees' }
    return inquirer.prompt([
        {
            type: 'list',
            message: 'Please choose an action:',
            name: 'choice',
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
        },
    ]);
}

function performAction(choiceObj){
    // destructure object for choice property
    const { choice } = choiceObj

    console.log(choice);
}

// events
promptAction()
.then(performAction)