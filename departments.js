const { inquirer, database, separator, wait, displayTable } = require('./global')
const roles = require('./roles')

const options = [
    { name: '\x1b[94mView Roles\x1b[0m', value: viewRoles },
    { name: '\x1b[92mAdd Role\x1b[0m', value: addRole },
    separator,
    { name: '\x1b[94mUpdate Name\x1b[0m', value: updateName },
    { name: '\x1b[91mRemove\x1b[0m', value: remove },
    separator,
    { name: 'Back', value: null }
]
async function displayDepartmentTable(records) {
    const headers = ['name']
    const rows = records.map(department => {
        return {
            value: department,
            cells: [
                department.name
            ]
        }
    })

    const department = await displayTable(headers, rows)

    if (department) 
        return await displayOptions(department)
    return null
}
async function displayOptions(department) {
    const { action } = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'What would you like to do with this department?',
        prefix: '-',
        choices: options,
        pageSize: 99
    }])

    if (action) {
        await action(department)
    }
}
async function display() {
    const records = await database.getDepartments()
    await displayDepartmentTable(records)
}
async function add() {
    const departments = (await database.getDepartments()).map(record => record.name)
    const info = await inquirer.prompt([{
        name: 'name',
        message: 'What is the name of the department?',
        prefix: '-',
        validate: input => {
            if (input.length == 0) return 'You must provide a department name.'
            if (departments.includes(input)) return 'A department with that name already exists.'
            return true
        }
    }])

    const id = await database.insertDepartment(info)
    console.log(id >= 0 ?
        `\x1b[32m  ${info.name} was added to departments.\x1b[0m` :
        `\x1b[31m  Could not insert department.\x1b[0m`
    )
    const department = (await database.getDepartmentByID(id))[0]
    return await displayOptions(department)
}
async function updateName(department) {
    const departments = (await database.getDepartments()).map(record => record.name)
    console.log('- What would you like to change the name to?')
    const info = await inquirer.prompt([{
        name: 'name',
        message: 'Name       |',
        prefix: ' ',
        default: department.name,
        validate: input => {
            if (input == department.name) return true
            if (input.length == 0) return 'You must provide a department name.'
            if (departments.includes(input)) return 'A department with that name already exists.'
            return true
        }
    }])

    const updated = await database.updateDepartment(department.id, info)

    const message = (() => {
        if (updated) {
            if (info.name == department.name)
                return `\x1b[33m  The name was not changed.\x1b[0m`
            if (info.name != department.name)
                return `\x1b[32m  The name has been changed to ${info.name}.\x1b[0m`
        } else
            return `\x1b[31m  The name could not be updated.\x1b[0m`
    })()

    console.log(message)
    return await displayOptions()
}
async function remove(department) {
    const departmentID = department.id
    const employeesInDepartment = await database.getDepartmentEmployees(departmentID)
    
    if (employeesInDepartment.length > 0) {
        console.log('  \x1b[33mThere are a number of employees in this department still. You will\n' + 
                    '  need to move them to another department before you can remove this.\x1b[0m')
    } else {
        const removed = await database.deleteDepartment(departmentID)
        
        const message = removed ?
            '\x1b[32m  The department has been removed.\x1b[0m' :
            '\x1b[31m  The department could not be removed.\x1b[0m'
        
        console.log(message)
    }
    await wait()
}

async function viewRoles(department) {
    await roles.display(department)
    await displayOptions(department)
}

async function addRole(department) {
    await roles.add(department)
    await displayOptions(department)
}

module.exports = { display, add }