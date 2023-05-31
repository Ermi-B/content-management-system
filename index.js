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
        inquirer //nested prompt
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

          inquirer //nested prompt
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
            db.query("SELECT * FROM role", (err, results) => {
              if (err) {
                console.error(err);
                return;
              }
              const roleData = results.map((role) => {
                return {
                  title: role.title,
                  id: role.id,
                };
              });
              const roleTitleArray = roleData.map((role) => role.title);
          
              db.query("SELECT * FROM manager", (err, results) => {
                if (err) {
                  console.error(err);
                  return;
                }
                const managersData = results.map((manager) => {
                  return {
                    name: manager.name,
                    id: manager.id,
                  };
                });
                const managerNamesArray = managersData.map((manager) => manager.name);
          
                inquirer
                  .prompt([
                    {
                      name: "employeeFirstName",
                      type: "input",
                      message: "What is the employee's first name?",
                    },
                    {
                      name: "employeeLastName",
                      type: "input",
                      message: "What is the employee's last name?",
                    },
                    {
                      name: "employeeRole",
                      type: "list",
                      message: "What is the employee's role?",
                      choices: roleTitleArray, // Array of role titles
                    },
                    {
                      name: "employeeManager",
                      type: "checkbox",
                      message: "Who is the employee's manager?",
                      choices: managerNamesArray, // Array of manager names
                      default:null
                    },
                  ])
                  .then((nestedPromptAns) => {
                    const role = roleData.find(
                      (role) => role.title === nestedPromptAns.employeeRole
                    ); // Find the role object based on the selected role title
                    const manager = managersData.find(
                      (manager) => manager.name === nestedPromptAns.employeeManager
                    ); // Find the manager object based on the selected manager name
          
                    db.query(
                      "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                      [
                        nestedPromptAns.employeeFirstName,
                        nestedPromptAns.employeeLastName,
                        role.id, // Use the role ID in the query
                        manager ? manager.id : null, // Use the manager ID if selected, otherwise null
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
            });
            break;
            
            case "update an employee role":
                // Fetch the employee data from the database
                db.query("SELECT * FROM employee", (err, results) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                  const employeesData = results.map((employee) => {
                    return {
                      name: `${employee.first_name} ${employee.last_name}`,
                      id: employee.id,
                    };
                  });
                  const employeeNamesArray = employeesData.map((employee) => employee.name);
              
                  db.query("SELECT * FROM role", (err, results) => {
                    if (err) {
                      console.error(err);
                      return;
                    }
                    const rolesData = results.map((role) => {
                      return {
                        title: role.title,
                        id: role.id,
                      };
                    });
                    const roleTitlesArray = rolesData.map((role) => role.title);
              
                    inquirer
                      .prompt([
                        {
                          name: "employeeToUpdate",
                          type: "list",
                          message: "Select the employee to update:",
                          choices: employeeNamesArray,
                        },
                        {
                          name: "newRole",
                          type: "list",
                          message: "Select the new role:",
                          choices: roleTitlesArray,
                        },
                      ])
                      .then((nestedPromptAns) => {
                        const employee = employeesData.find(
                          (emp) => emp.name === nestedPromptAns.employeeToUpdate
                        ); // Find the employee object based on the selected employee name
                        const role = rolesData.find(
                          (role) => role.title === nestedPromptAns.newRole
                        ); // Find the role object based on the selected role title
              
                        db.query(
                          "UPDATE employee SET role_id = ? WHERE id = ?",
                          [role.id, employee.id],
                          (err, result) => {
                            if (err) {
                              console.error(err);
                            } else {
                              console.log(
                                `Employee role updated successfully for ${nestedPromptAns.employeeToUpdate}`
                              );
                            }
                          }
                        );
                      });
                  });
                });
                break;
                 
    }
  });
