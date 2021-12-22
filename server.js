const consoleTable = require('console.table')
const inquirer = require('inquirer')
const showBanner = require('node-banner');

const db = require('./config/connection');
const { allDepartments, allDepartmentsDisplay, allRoles, allRolesDisplay, allEmployees, allEmployeesDisplay, insertDepartment, insertRole, insertEmployee } = require('./db/dbFunc')




async function init() {
    await showBanner('Employee Tracker', '', 'green')
    await questions()
}
function questions() {
    inquirer.prompt(
        [
            {
                name: 'initial',
                type: 'list',
                message: 'What would you like to do?',
                choices: ["View All Departments", "View All Roles", "View all Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", 'Remove a Department', 'Remove a Role', 'Remove an Employee', 'Exit Program']

            }
        ]
    ).then((answers) => {
        switch (answers.initial) {
            case "View All Departments": viewAllDepartments()
                break;
            case "View All Roles": viewAllRoles()
                break;
            case "View all Employees": viewAllEmployees()
                break
            case "Add a Department": addNewDepartment()
                break
            case "Add a Role": addNewRole()
                break
            case "Add an Employee": addNewEmployee()
                break
            case "Update an Employee Role": updateEmployee()
                break
            case 'Remove a Department': deleteDepartment()
                break
            case 'Remove a Role': deleteRole()
                break
            case 'Remove an Employee': deleteEmployee()
                break
            default: exitInquirer()
                break
        }
    })

}


function viewAllDepartments() {
    db.query(allDepartmentsDisplay, (err, results) => {
        console.table(results)
        questions()
    })
}

function viewAllRoles() {
    db.query(allRolesDisplay, function (err, results) {
        console.table(results);
        questions()
    })
}

function viewAllEmployees() {
    db.query(allEmployeesDisplay, function (err, results) {
        console.table(results);
        questions()
    })
}

function addNewDepartment() {
    inquirer.prompt([
        {
            name: "departmentName",
            type: "input",
            message: "What is the new department's name?",
            validate: function (answer) {
                if (answer.length < 1) {
                    return console.log("Please enter the name of the new department")
                }
                return true;
            },
        },
    ])
        .then((answers) => {
            db.query(insertDepartment, `${answers.departmentName}`, function (err, results) {
                console.log(`~~${answers.departmentName} department added!~~`)
                questions()
            })
        })
}

function addNewRole() {
    db.query(allDepartments, function (err, results) {
        var allDept = []
        for (let i = 0; i < results.length; i++) {
            var obj = {
                name: results[i].name,
                value: results[i].id
            }
            allDept.push(obj)
        }
        inquirer.prompt(
            [
                {
                    name: "roleName",
                    type: "input",
                    message: "What is the name of this role?",
                    validate: function (answer) {
                        if (answer.length < 1) {
                            return console.log("Please enter the name of the new role!");
                        }
                        return true;
                    },
                },
                {
                    name: "roleSalary",
                    type: "input",
                    message: "What is the salary for this role?",
                    validate: function (answer) {
                        if (isNaN(answer)) {
                            return console.log("Please enter a number");
                        } if (answer.length < 1) {
                            return console.log('Please give your employee a salary!')
                        }
                        return true;
                    },
                },
                {
                    name: "roleDepartment",
                    type: "list",
                    message: "What department should this be assigned to?",
                    choices: allDept
                }
            ]
        )
            .then((answers) => {
                db.query(insertRole, [answers.roleName, answers.roleSalary, answers.roleDepartment], function (err, results) {
                    console.log(`${answers.roleName} has been added! to ${answers.roleDepartment}`)
                    questions()
                })
            })
    })
}

function addNewEmployee() {
    db.query(allRoles, function (err, results) {
        var allRoles = []
        for (let i = 0; i < results.length; i++) {
            var obj = {
                name: results[i].title,
                value: results[i].id
            }
            allRoles.push(obj)
        }
        db.query(allEmployees, function (err, results) {
            var allManagers = []
            for (let i = 0; i < results.length; i++) {
                var obj2 = {
                    name: `${results[i].first_name} ${results[i].last_name}`,
                    value: results[i].id
                }
                allManagers.push(obj2)
            }
            allManagers.push({ name: "No Manager", value: null })
            inquirer.prompt(
                [
                    {
                        name: "employeeFirstName",
                        type: "input",
                        message: "What is the employee's first name?",
                        validate: function (answer) {
                            if (answer.length < 1) {
                                return console.log("Enter a first name");
                            }
                            return true;
                        },
                    },
                    {
                        name: "employeeLastName",
                        type: "input",
                        message: "What is the employee's last name?",
                        validate: function (answer) {
                            if (answer.length < 1) {
                                return console.log('Enter a last name');
                            }
                            return true;
                        },
                    },
                    {
                        name: "employeeRole",
                        type: "list",
                        message: "What role is this employee in?",
                        choices: allRoles
                    },
                    {
                        name: "employeeManager",
                        type: "list",
                        message: "Does this employee have a manager?",
                        choices: allManagers
                    }
                ]
            )
                .then((answers) => {
                    db.query(insertEmployee, [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager], function (err, results) {
                        console.log(`${answers.employeeFirstName} has been added!`)
                        questions()
                    })
                })
        })
    })
}

function updateEmployee() {
    db.query(allEmployees, function (err, results) {
        var allEmployeesArray = []
        for (let i = 0; i < results.length; i++) {
            var obj = {
                name: `${results[i].first_name} ${results[i].last_name}`,
                value: results[i].id
            }
            allEmployeesArray.push(obj)
        }
        db.query(allRoles, function (err, results) {
            var roleArray = []
            for (let i = 0; i < results.length; i++) {
                var obj = {
                    name: results[i].title,
                    value: results[i].id
                }
                roleArray.push(obj)
            }
            inquirer.prompt(
                [
                    {
                        name: "employeeNames",
                        type: "list",
                        message: "What is the employee's name?",
                        choices: allEmployeesArray
                    },
                    {
                        name: "employeeNewRole",
                        type: "list",
                        message: "What is the employee's new role?",
                        choices: roleArray
                    }
                ]
            )
                .then((answers) => {
                    db.query(`UPDATE employee SET role_id=${answers.employeeNewRole} WHERE id=${answers.employeeNames}`, function (err, results) {
                        console.log(`Role has been changed!`)
                        questions()
                    })
                })
        })
    })
}

function deleteDepartment() {
    db.query(allDepartments, function (err, results) {
        var allDept = []
        for (let i = 0; i < results.length; i++) {
            var obj = {
                name: results[i].name,
                value: results[i].id
            }
            allDept.push(obj)
        }
        inquirer.prompt([
            {
                name: 'departmentName',
                type: 'list',
                message: 'Which department would you like to remove?',
                choices: allDept
            }
        ]).then((answers) => {

            db.query(`DELETE FROM department WHERE id=${answers.departmentName}`)
            console.log('Department Deleted!')
            questions()
        })
    })
}

function deleteRole() {
    db.query(allRoles, function (err, results) {
        var roleArray = []
        for (let i = 0; i < results.length; i++) {
            var obj = {
                name: results[i].title,
                value: results[i].id
            }
            roleArray.push(obj)

        }
        inquirer.prompt([
            {
                name: 'roleName',
                type: 'list',
                message: 'Which role would you like to remove?',
                choices: roleArray
            }
        ]).then((answers) => {
            db.query(`DELETE FROM role WHERE id=${answers.roleName}`)
            console.log('Role Deleted!')
            questions()
        })
    })
}

function deleteEmployee() {
    db.query(allEmployees, function (err, results) {
        var employees = []
        for (let i = 0; i < results.length; i++) {
            var obj = {
                name: `${results[i].first_name} ${results[i].last_name}`,
                value: results[i].id
            }
            employees.push(obj)
        }
        inquirer.prompt([
            {
                name: 'employeeName',
                type: 'list',
                message: 'Which employee would you like to remove?',
                choices: employees
            }
        ]).then((answers) => {

            db.query(`DELETE FROM employee WHERE id=${answers.employeeName}`)
            console.log('Employee Deleted!')
            questions()
        })
    })
}

function exitInquirer() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'exit',
            message: 'Are you sure you want to exit?'
        },
    ])
        .then((answers) => {
            if (answers.exit) {
                console.log(`See ya' next time!`)
                process.exit()
            } else {
                init()
            }
        })
}

init()