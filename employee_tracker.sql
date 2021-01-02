DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

###########################
###    CREATE TABLES    ###
###########################
CREATE TABLE department (
	id INT AUTO_INCREMENT,
	name VARCHAR(30),
	PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT AUTO_INCREMENT,
	title VARCHAR(30),
	salary  DECIMAL,
	department_id INT,
	PRIMARY KEY (id),
	FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
	id INT AUTO_INCREMENT,
	first_name VARCHAR(30),
	last_name VARCHAR(30),
	manager_id INT,
	role_id INT,
	PRIMARY KEY (id),
	FOREIGN KEY (role_id) REFERENCES role(id),
	FOREIGN KEY (manager_id) REFERENCES employee(id)
);

###########################
###     INSERT ROWS     ###
###########################
INSERT INTO department (name) VALUES
	('Sales'),
	('Engineering'),
	('Finance'),
	('Legal');
    
INSERT INTO role (title, salary, department_id) VALUES
	('Sales Lead', 100000, 1),
	('Salesperson', 80000, 1),
	('Lead Engineer', 150000, 2),
	('Software Engineer', 120000, 2),
	('Account Manager', 140000, 3),
	('Accountant', 125000, 3),
	('Legal Team Lead', 250000, 4),
	('Lawyer', 190000, 4);
    
INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES
	('Ashley', 'Upshaw', null, 1),
	('Jeff', 'Schlesinger', 1, 2),
	('Kera', 'Lopez', 1, 2),
	('Marian', 'Upshaw', 1, 2),
	('Sallie', 'Cramer', 1, 2),
	('Ada', 'Lovelace', null, 3),
	('Nathan', 'Pardue', null, 3),
	('Ronald', 'Burch', 6, 4),
	('Danny', 'Moniz', 6, 4),
	('Thomas', 'Matthews', 6, 4),
	('Cynthia', 'Rodriguez', 7, 4),
	('Pedro', 'Rodriguez', 7, 4),
	('Grace', 'Braxton', 7, 4),
	('John', 'Blain', null, 5),
	('Shannon', 'Wong', null, 5),
	('Richard', 'Tallman', 14, 6),
	('Miriam', 'Tillotson', 14, 6),
	('Jeffery', 'Black', 14, 6),
	('Cassandra', 'Quinn', 15, 6),
	('Patrick', 'Andrew', 15, 6),
	('Evelyn', 'Wu', null, 7),
	('Rayla', 'Xiong', null, 7),
	('Minnie', 'Slye', 21, 8),
	('Delores', 'Crum', 21, 8),
	('John', 'Cohen', 22, 8),
	('Jose', 'Vargas', 22, 8);

###########################
###    CREATE VIEWS     ###
###########################
CREATE VIEW employee_view AS
	SELECT 
		e.id, 
        e.first_name,
        e.last_name,
        e.manager_id,
        CONCAT(m.first_name, " ", m.last_name) AS manager,
        e.role_id,
        r.title,
        r.salary,
        r.department_id,
        d.name AS department
	FROM employee e
	LEFT JOIN employee m ON e.manager_id = m.id
	LEFT JOIN role r ON e.role_id = r.id
	LEFT JOIN department d ON r.department_id = d.id;
SELECT * FROM employee_view;

CREATE VIEW manager_view AS
	SELECT *
	FROM employee_view
	WHERE id IN (
		SELECT manager_id
		FROM employee
		WHERE manager_id IS NOT NULL
		GROUP BY manager_id
	);
SELECT * FROM manager_view;
SELECT * FROM employee_display_view WHERE `manager_id` = 6;