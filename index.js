const inquirer = require('inquirer')
const mysql = require('mysql2')

//database connection
const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'Password123',
    database:'employee_db'
},console.log('connected to database. OK!'))

//user propmpts
const r = inquirer.prompt([
    {
        'type':'list',
        'message':'What do you want to do?',
        'name':'directory',
        'choices':["view all departments","view all roles","view all employees","add a department","add a role","add an employee","update an employee role"]
    }
])
.then((ans)=>console.log(ans))

