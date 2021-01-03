const {inquirer, database, separator, wait, displayTable} = require('./global')

async function displayEmployeeTable(records) {
    const headers = ['name', 'title', 'department', 'salary', 'manager']
    const rows = records.map(employee => {
        return {
            value: employee,
            cells: [
                employee.first_name + ' ' + employee.last_name,
                employee.title,
                employee.department,
                employee.salary,
                employee.manager,
            ]
        }
    })

    const employee = await displayTable(headers, rows)
    
    if (employee) {
        const {action} = await inquirer.prompt([{
            name: 'action',
            type: 'list',
            message: 'What would you like to do with this employee?',
            prefix: '-',
            choices: employeeOptions
        }])

        if (action) {
            return await action(employee)
        }
    }
    return null
}
async function display() {
    const records = await database.getEmployees()
    await displayEmployeeTable(records)
}
async function displayByDepartment() {
    const departments = (await database.getDepartments()).map(record => {
        return {
            name: record.name,
            value: record
        }
    })
    const {department} = await inquirer.prompt([{
        name: 'department',
        type: 'list',
        message: 'What department would you like to see the employees of?',
        prefix: '-',
        choices: departments
    }])

    const records = await database.getEmployees({department: department.name})
    await displayEmployeeTable(records)
}
async function displayByManager() {
    const managers = (await database.getManagers())
        .sort((a, b) => {
            if (a.full_name > b.full_name)
                return 1
            if (a.full_name < b.full_name)
                return -1
                
            return 0
        })
        .map(manager => {
            return {
                name: `${manager.full_name} - ${manager.title}`,
                value: manager
            }
        })
    const {manager} = await inquirer.prompt([{
        name: 'manager',
        type: 'list',
        message: 'What manager would you like to see the employees of?',
        prefix: '-',
        choices: managers
    }])

    const records = await database.getEmployees({manager_id: manager.id})
    await displayEmployeeTable(records)
}

async function add() {
    const {first_name, last_name} = await inquirer.prompt([{
        name: 'first_name',
        message: 'First Name |',
        prefix: ' ',
        validate: input => input.length > 1 || 'You must provide the employee\'s first name.'
    }, {
        name: 'last_name',
        message: 'Last Name  |',
        prefix: ' ',
        validate: input => input.length > 1 || 'You must provide the employee\'s last name.'
    }])

    const departments = (await database.getDepartments()).map(department => {
        return {
            value: department.id,
            name: department.name
        }
    })
    const {department_id} = await inquirer.prompt([{
        name: 'department_id',
        type: 'list',
        message: 'Department |',
        prefix: ' ',
        choices: departments
    }])

    const roles = (await database.getDepartmentRoles(department_id)).map(role => {
        return {
            value: role.id,
            name: role.title
        }
    })
    const employees = [...(await database.getDepartmentEmployees(department_id)).map(employee => {
        return {
            value: employee.id,
            name: `${employee.full_name} - ${employee.title}`
        }
    }), separator, {value: null, name: 'None'}]
    if (employees.length > 10) employees.push(separator)
    const {role_id, manager_id} = await inquirer.prompt([{
        name: 'role_id',
        type: 'list',
        message: 'Role       |',
        choices: roles,
        pageSize: 10,
        prefix: ' '
    }, {
        name: 'manager_id',
        type: 'list',
        message: 'Manager    |',
        prefix: ' ',
        choices: employees,
        pageSize: 10
    }])

    const newID = await database.insertEmployee({first_name, last_name, role_id, manager_id}) 
    const message = newID > 0 ?
        `\x1b[32m  ${first_name + ' ' + last_name} was added to employees.\x1b[0m` :
        '\x1b[31m  Could not insert employee.\x1b[0m'
    console.log(message)
    await wait()
    return newID
}

const employeeOptions = [
    {name: '\x1b[94mUpdate Name\x1b[0m', value: updateName},
    {name: '\x1b[94mUpdate Manager\x1b[0m', value: updateManager},
    {name: '\x1b[94mUpdate Role\x1b[0m', value: updateRole},
    {name: '\x1b[94mUpdate Department\x1b[0m', value: updateDepartment},
    {name: '\x1b[91mRemove Employee\x1b[0m', value: remove},
    separator,
    {name: 'Nothing', value: null}
]
async function updateName(employee) {
    const info = await inquirer.prompt([{
        name: 'first_name',
        message: 'First Name |',
        prefix: ' ',
        validate: input => input.length > 1 || 'You must provide the employee\'s first name.',
        default: employee.first_name
    }, {
        name: 'last_name',
        message: 'Last Name  |',
        prefix: ' ',
        validate: input => input.length > 1 || 'You must provide the employee\'s last name.',
        default: employee.last_name
    }])

    const updated = await database.updateEmployee(employee.id, info)

    const message = (() => {
        if (updated) {
            if (employee.first_name != info.first_name && employee.last_name != info.last_name)
                return `\x1b[32m  The name has been changed to ${info.first_name + ' ' + info.last_name}.\x1b[0m`
            if (employee.first_name != info.first_name && employee.last_name == info.last_name)
                return `\x1b[32m  The first name has been changed to ${info.first_name}.\x1b[0m`
            if (employee.first_name == info.first_name && employee.last_name != info.last_name)
                return `\x1b[32m  The last name has been changed to ${info.last_name}.\x1b[0m`
            if (employee.first_name == info.first_name && employee.last_name == info.last_name)
                return `\x1b[33m  The name was not changed.\x1b[0m`
        } else {
            return `\x1b[31m  The name could not be updated.\x1b[0m`
        }
    })()
        
    console.log(message);
    await wait()
    return updated
}
async function getManager(department_id, except) {
    const employees = [...(await database.getDepartmentEmployees(department_id, except)).map(employee => {
        return {
            value: employee,
            name: `${employee.full_name} - ${employee.title}`
        }
    }), separator, {name: 'None', value: {id: null, full_name: null, title: null}}]
    if (employees.length > 10) employees.push(separator)
    const {manager} = await inquirer.prompt([{
        name: 'manager',
        type: 'list',
        message: 'Manager    |',
        prefix: ' ',
        choices: employees,
        pageSize: 10
    }])
    return manager
}
async function updateManager(employee) {
    const manager = await getManager(employee.department_id, employee.id)
    const updated = await database.updateEmployee(employee.id, {manager_id: manager ? manager.id : null})

    const message = (() => {
        if (updated) {
            if (employee.manager != manager.full_name) {
                return manager.full_name != null ?
                    `\x1b[32m  The manager was changed to ${manager.full_name}.\x1b[0m` :
                    `\x1b[32m  The employee no longer has a manager'.\x1b[0m`
            } else {
                return `\x1b[33m  The manager was not changed.\x1b[0m`
            }
        } else {
            return `\x1b[31m  The manager could not be updated.\x1b[0m`
        }
    })()

    console.log(message);
    await wait()
    return updated
}

async function getRole(department_id) {
    const roles = (await database.getDepartmentRoles(department_id)).map(role => {
        return {
            value: role,
            name: role.title
        }
    })
    const {role} = await inquirer.prompt([{
        name: 'role',
        type: 'list',
        message: 'Role       |',
        prefix: ' ',
        choices: roles,
        pageSize: 10
    }])
    return role
}
async function updateRole(employee) {
    const department_id = employee.department_id
    const employee_id = employee.id
    
    const role = await getRole(department_id)
    const manager = await getManager(department_id, employee_id)

    const updated = await database.updateEmployee(employee_id, {
        role_id: role.id,
        manager_id: manager.id
    })

    const message = (() => {
        if (updated) {
            if (employee.title == role.title && employee.manager == manager.full_name)
                return `\x1b[33m  The role and managager were not changed.\x1b[0m`
            if (employee.title != role.title && employee.manager == manager.full_name)
                return `\x1b[32m  The role was changed to ${role.title}.\x1b[0m`
            const changedManager = () => {
                return manager.full_name != null ? 
                    `the manager is now ${manager.full_name}` :
                    `the employee no longer has a manager`
            }
            if (employee.title == role.title && employee.manager != manager.full_name)
                return `\x1b[32m  The role was not changed, but ${changedManager()}.\x1b[0m`
            if (employee.title != role.title && employee.manager != manager.full_name)
                return `\x1b[32m  The role was changed to ${role.title} and ${changedManager()}.\x1b[0m`
        } else {
            return `\x1b[31m  The manager could not be updated.\x1b[0m`
        }
    })()

    console.log(message);
    await wait()
    return updated
}

async function getDepartment() {
    const departments = (await database.getDepartments()).map(department => {
        return {
            name: department.name,
            value: department
        }
    })
    const {department} = await inquirer.prompt([{
        name: 'department',
        type: 'list',
        message: 'Department |',
        prefix: ' ',
        choices: departments
    }])
    return department
}
async function updateDepartment(employee) {
    const department = await getDepartment()
    const department_id = department.id
    const employee_id = employee.id

    const role = await getRole(department_id)
    const manager = await getManager(department_id, employee_id)

    const updated = await database.updateEmployee(employee_id, {
        role_id: role.id,
        manager_id: manager.id
    })

    const message = (() => {
        if (updated) {
            if (employee.department == department.name) {
                if (employee.title == role.title && employee.manager == manager.full_name)
                    return `\x1b[33m  The nothing was not changed.\x1b[0m`
                if (employee.title != role.title && employee.manager == manager.full_name)
                    return `\x1b[32m  The department wasn't changed, but the role was changed to ${role.title}.\x1b[0m`
                const changedManager = () => {
                    return manager.full_name != null ? 
                        `the manager is now ${manager.full_name}` :
                        `the employee no longer has a manager`
                }
                if (employee.title == role.title && employee.manager != manager.full_name)
                    return `\x1b[32m  The department and role was not changed, but ${changedManager()}.\x1b[0m`
                if (employee.title != role.title && employee.manager != manager.full_name)
                    return `\x1b[32m  The department wasn't changed, but the role was changed to ${role.title} and ${changedManager()}.\x1b[0m`
            } else {
                return `\x1b[32m  The department was changed to ${department.name} in the role of ${role.title} with ${manager.full_name ? 
                    `${manager.full_name} as the manager` : 
                    `no manager`}.\x1b[0m`
            }
        } else {
            return `\x1b[31m  The manager could not be updated.\x1b[0m`
        }
    })()

    console.log(message);
    await wait()
    return updated
}

async function remove(employee) {
    const removed = await database.deleteEmployee(employee.id)
    console.log(removed ? 
        `\x1b[32m  ${employee.first_name + ' ' + employee.last_name} was removed.\x1b[0m` :
        `\x1b[31m  The employee could not be removed.\x1b[0m`)
    await wait()
    return removed
}

module.exports = {
    display, 
    displayByDepartment,
    displayByManager,
    add
}