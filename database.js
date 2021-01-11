const mysql = require('mysql')
const util = require('util')
require('console.table')
// const fs = require('fs')

const connection = mysql.createConnection({
	host: 'localhost',
	post: 3306,
	user: 'vbcode',
	password: 'password',
	database: 'employee_tracker_db'
})

const query = util.promisify(connection.query).bind(connection)

async function runQuery(string, args) {
	try {
		const rows = await query(string, args)
		return rows
	} catch (error) {
		throw error
	}
}

const database = {
	getEmployees,
	getEmployeeByID,
	getDepartments,
	getDepartmentByID,
	getRoleByID,
	getDepartmentRoles,
	getAllTitles,
	getDepartmentEmployees,
	getRoleEmployees,
	getManagers,

	insertEmployee,
	updateEmployee,
	deleteEmployee,

	insertRole,
	updateRole,
	deleteRole,

	insertDepartment,
	updateDepartment,
	deleteDepartment,

	closeConnection
}

async function getEmployees(where) {
	return where
		? await runQuery(`SELECT * FROM employee_view WHERE ?`, where)
		: await runQuery(`SELECT * FROM employee_view`)
}
async function getEmployeeByID(id) {
	return await runQuery('SELECT *\nFROM employee_view\nWHERE ?', {id})
}

async function getDepartments() {
	return await runQuery('SELECT *\nFROM department\nORDER BY name')
}
async function getDepartmentByID(id) {
	return await runQuery('SELECT *\nFROM department\nWHERE ?', {id})
}

async function getRoleByID(id) {
	return await runQuery('SELECT *\nFROM role\nWHERE ?', {id})
}

async function getManagers() {
	return await runQuery(
		'SELECT id, CONCAT(first_name, " ", last_name) AS full_name, title\nFROM manager_view'
	)
}

async function getDepartmentRoles(departmentID) {
	return await runQuery('SELECT *\nFROM role\nWHERE ?', { department_id: departmentID })
}

async function getAllTitles() {
	return await runQuery('SELECT title\nFROM role')
}

async function getDepartmentEmployees(departmentID, except = -1) {
	return await runQuery(
		'SELECT id, CONCAT(first_name, " ", last_name) AS full_name, title\nFROM employee_view\nWHERE ?\nAND id <> ?',
		[{ department_id: departmentID }, except]
	)
}

async function getRoleEmployees(roleID) {
	return await runQuery(
		'SELECT *\nFROM employee_view\nWHERE ?', { role_id: roleID }
	)
}

async function insertEmployee(info) {
	const data = await query(`INSERT INTO employee\nSET ?`, info)
	return data.insertId
}

async function updateEmployee(id, info) {
	const data = await query(`UPDATE employee\nSET ?\nWHERE ?`, [info, { id }])
	return data.affectedRows > 0
}

async function deleteEmployee(id) {
	const data = await query(`DELETE FROM employee\nWHERE ?`, { id })
	return data.affectedRows > 0
}

async function insertRole(info) {
	const data = await query(`INSERT INTO role\nSET ?`, info)
	return data.insertId
}
async function updateRole(id, info) {
	const data = await query(`UPDATE role\nSET ?\nWHERE ?`, [info, { id }])
	return data.affectedRows > 0
}
async function deleteRole(id) {
	const data = await query(`DELETE FROM role\nWHERE ?`, { id })
	return data.affectedRows > 0
}

async function insertDepartment(info) {
	const { insertId } = await query(`INSERT INTO department\nSET ?`, info)
	return insertId
}
async function updateDepartment(id, info) {
	const data = await query(`UPDATE department\nSET ?\nWHERE ?`, [
		info,
		{ id }
	])
	return data.affectedRows > 0
}
async function deleteDepartment(id) {
	const data = await query(`DELETE FROM department\nWHERE ?`, { id })
	return data.affectedRows > 0
}

function closeConnection() {
	connection.end()
}

async function reset() {
	// const sql = fs.readFileSync('./employee_tracker.sql', 'utf-8')
	// const statments = sql.split(';').map(statment => statment.split('\n')
	//     .filter(line => line.length > 0 && line[0] != '#')
	//     .join('\n'))
	// // console.log(statments.join('\n\n\n').replace('\t', ''));
	// // for (const statment of statments) {
	// //     console.log(statment);
	// //     const responce = await query(statment)
	// //     console.log(responce);
	// // }
	// const responce = await query(statments.join(';\n\n\n'))
	// console.log(responce);
}

async function printTable(table, where) {
	if (where.length) {
		where = where.reduce((obj, val) => {
			const [key, value] = val.split(':')
			obj[key] = value
			return obj
		}, {})
		const records = await query(`SELECT * FROM ${table} WHERE ?`, where)
		console.table(records)
	} else {
		const records = await query(`SELECT * FROM ${table}`)
		console.table(records)
	}
}

async function call() {
	if (process.argv[1].split('\\').pop() == 'database.js') {
		for (const option of process.argv.slice(2)) {
			if (option == '-r') reset()
			else if (option.substr(0, 3) == '-pt') {
				let [table, ...where] = option.split('.').slice(1)
				await printTable(table, where)
			} else eval(option)
		}
		connection.end()
	}
}
if (process.argv.length > 2) call()

module.exports = database
