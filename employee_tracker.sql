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
	role_id INT,
	manager_id INT,
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
    
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
	('Ashley', 'Upshaw', 1, null),
	('Jeff', 'Schlesinger', 2, 1),
	('Kera', 'Lopez', 2, 1),
	('Marian', 'Upshaw', 2, 1),
	('Sallie', 'Cramer', 2, 1),
	('Ada', 'Lovelace', 3, null),
	('Nathan', 'Pardue', 3, null),
	('Ronald', 'Burch', 4, 6),
	('Danny', 'Moniz', 4, 6),
	('Thomas', 'Matthews', 4, 6),
	('Cynthia', 'Rodriguez', 4, 7),
	('Pedro', 'Rodriguez', 4, 7),
	('Grace', 'Braxton', 4, 7),
	('John', 'Blain', 5, null),
	('Shannon', 'Wong', 5, null),
	('Richard', 'Tallman', 6, 14),
	('Miriam', 'Tillotson', 6, 14),
	('Jeffery', 'Black', 6, 14),
	('Cassandra', 'Quinn', 6, 15),
	('Patrick', 'Andrew', 6, 15),
	('Evelyn', 'Wu', 7, null),
	('Rayla', 'Xiong', 7, null),
	('Minnie', 'Slye', 8, 21),
	('Delores', 'Crum', 8, 21),
	('John', 'Cohen', 8, 22),
	('Jose', 'Vargas', 8, 22);

###########################
###    CREATE VIEWS     ###
###########################
CREATE VIEW employee_view AS
	SELECT 
		e.id, 
		e.first_name, 
        e.last_name, 
        r.title, 
        d.name AS department, 
        r.salary, 
        CONCAT(m.first_name, " ", m.last_name) AS manager
	FROM employee e
	LEFT JOIN employee m ON e.manager_id = m.id
	LEFT JOIN role r ON e.role_id = r.id
	LEFT JOIN department d ON r.department_id = d.id;