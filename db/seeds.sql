-- Insert sample departments
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Marketing');
INSERT INTO department (name) VALUES ('Human Resources');

-- Insert sample roles
INSERT INTO role (title, salary, department_id) VALUES ('Manager', 5000.00, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Salesperson', 3000.00, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Marketing Specialist', 4000.00, 2);
INSERT INTO role (title, salary, department_id) VALUES ('HR Coordinator', 3500.00, 3);

-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id) VALUES ('John', 'Doe', 1);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Jane', 'Smith', 2);
INSERT INTO employee (first_name, last_name, role_id) VALUES ('Michael', 'Johnson', 3);
 