const inquirer = require("inquirer");
const mysql = require("mysql2");

//database connection
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Password123",
    database: "employee_db",
  },
  console.log("connected to database. OK!")
);

//user prompt
const r = inquirer
  .prompt([
    {
      type: "list",
      message: "What do you want to do?",
      name: "directory",
      choices: [
        "view all departments",
        "view all roles",
        "view all employees",
        "add a department",
        "add a role",
        "add an employee",
        "update an employee role",
      ],
    },
  ])
  .then((promptAns) => {
    switch (promptAns.directory) {
      case "view all departments":
        db.query("SELECT * FROM department", (err, results) =>
          console.table(results)
        );
        break;
      case "view all roles":
        db.query("SELECT * FROM role", (err, results) =>
          console.table(results)
        );
        break;
      case "view all employees":
        db.query("SELECT * FROM employee", (err, results) =>
          console.table(results)
        );
        break;
      case "add a department":  
        inquirer    //nested prompt
          .prompt([
            {
              name: "deptName",
              type: "input",
              message: "What is the name of the department?",
            },
          ])
          .then((nestedPromptAns) => {
            db.query(
              "INSERT INTO department(name) VALUES (?)",
              [nestedPromptAns.deptName],
              (err, result) => {
                if (err) {
                  console.error(err);
                } else {
                  console.log(
                    `${nestedPromptAns.deptName} was added successfully!`
                  );
                }
              }
            );
          });
        break;
      case "add a role":
        db.query("SELECT * from department", (err, results) => {
          if (err) {
            console.error(err);
          }
          const departmentsData = results.map((department) => {
            return {
              name: department.name,
              id: department.id,
            };
          });
          console.log(departmentsData);
          const departmentNamesArray = departmentsData.map((dept) => dept.name);
          console.log(departmentNamesArray);

          inquirer   //nested prompt
            .prompt([
              {
                name: "roleName",
                type: "input",
                message: "What is the name of the role?",
              },
              {
                name: "roleSalary",
                type: "input",
                message: "What is the Salary of the role?",
              },
              {
                name: "roleDepartment",
                type: "list",
                message: "Which department does it belong to?",
                choices: departmentNamesArray,
              },
            ])
            .then((nestedPromptAns) => {
              const department = departmentsData.find((dept) => {
                if (dept.name === nestedPromptAns.roleDepartment) {
                  return true;
                }
              }); //searches the returned object from to databse for matching department name to get its ID
              
              db.query(
                "INSERT INTO role(title,salary,department_id) VALUES (?,?,?)",
                [
                  nestedPromptAns.roleName,
                  nestedPromptAns.roleSalary,
                  department.id,
                ],
                (err, result) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(
                      `${nestedPromptAns.roleName} was added successfully!`
                    );
                  }
                }
              );
            });
        });

        break;

        case "add an employee":
        db.query("SELECT * from role", (err, results) => {
          if (err) {
            console.error(err);
          }
          const roleData = results.map((role) => {  //getting the role id and title to assign it to the new employee
            return {
              title: role.title,
              id: role.id,
            };
          });
          console.log(roleData);
          const roletitleArray = roleData.map((role) => role.title);
          console.log(roletitleArray);

          inquirer   //nested prompt
            .prompt([
              {
                name: "employeeFirstName",
                type: "input",
                message: "What is the employee's first Name?",
              },
              {
                name: "employeeLastName",
                type: "input",
                message: "What is the employee's last Name?",
              },
              {
                name: "employeeRole",
                type: "list",
                message: "What is the employee's role?",
                choices:roletitleArray
              },
              {
                name: "employeeManager",
                type: "list",
                message: "Who is the employee's manager?",
                choices: [1,2,3,4],
              },
            ])
            .then((nestedPromptAns) => {
              const role = roleData.find((role) => {
                if (role.title === nestedPromptAns.employeeRole) {
                  return true;
                }
              }); //searches the returned object from to databse for matching department name to get its ID
              
              db.query(
                "INSERT INTO employee(first_name,last_Name,role_id) VALUES (?,?,?)",
                [
                  nestedPromptAns.employeeFirstName,
                  nestedPromptAns.employeeLastName,
                  role.id,
                 
                ],
                (err, result) => {
                  if (err) {
                    console.error(err);
                  } else {
                    console.log(
                      `${nestedPromptAns.employeeFirstName} was added successfully!`
                    );
                  }
                }
              );
            });
        });

        break;
    }
  });
