const mysql = require('mysql')
const util = require('util')
const cTable = require('console.table')

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
    getDepartments,
    getDepartmentRoles,
    getDepartmentEmployees,
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
    return where ?
        await runQuery(`SELECT * FROM employee_view WHERE ?`, where) :
        await runQuery(`SELECT * FROM employee_view`)
}

async function getDepartments() {
    return await runQuery('SELECT *\nFROM department')
}

async function getManagers() {
    return await runQuery('SELECT id, CONCAT(first_name, " ", last_name) AS full_name, title\nFROM manager_view')
}

async function getDepartmentRoles(department_id) {
    return await runQuery('SELECT *\nFROM role\nWHERE ?', {department_id})
}

async function getDepartmentEmployees(department_id, except=-1) {
    return await runQuery('SELECT id, CONCAT(first_name, " ", last_name) AS full_name, title\nFROM employee_view\nWHERE ?\nAND id <> ?', [{department_id}, except])
}

async function insertEmployee(info) {
    const data = await query(`INSERT INTO employee\nSET ?`, info)
    return data.insertId
}

async function updateEmployee(id, info) {
    const data = await query(`UPDATE employee\nSET ?\nWHERE ?`, [info, {id}])
    return data.affectedRows > 0
}

async function deleteEmployee(id) {
    const data = await query(`DELETE FROM employee\nWHERE ?`, {id})
    return data.affectedRows > 0
}

async function insertRole(info) {
    const data = await query(`INSERT INTO role\nSET ?`, info)
    return data.insertId
}
async function updateRole(id, info) {
    const data = await query(`UPDATE role\nSET ?\nWHERE ?`, [info, {id}])
    return data.affectedRows > 0
}
async function deleteRole(id) {
    const data = await query(`DELETE FROM role\nWHERE ?`, {id})
    return data.affectedRows > 0
}

async function insertDepartment(info) {
    const {insertId} = await query(`INSERT INTO department\nSET ?`, info)
    return insertId
}
async function updateDepartment(id, info) {
    const data = await query(`UPDATE department\nSET ?\nWHERE ?`, [info, {id}])
    return data.affectedRows > 0
}
async function deleteDepartment(id) {
    const data = await query(`DELETE FROM department\nWHERE ?`, {id})
    return data.affectedRows > 0
}

function closeConnection() {
    connection.end()
}

module.exports = database