const { inquirer, database, separator, wait, displayTable } = require('./global')

const departmentOptions = [
    { name: '\x1b[94mUpdate name\x1b[0m', value: updateDepartmentName },
    { name: '\x1b[91mRemove department\x1b[0m', value: removeDepartment },
    separator,
    { name: 'Nothing', value: null }
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

    if (department) {
        const { action } = await inquirer.prompt([{
            name: 'action',
            type: 'list',
            message: 'What would you like to do with this department?',
            prefix: '-',
            choices: departmentOptions
        }])

        if (action) {
            return await action(department)
        }
    }
    return null
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
    await wait()
    return id
}
async function updateDepartmentName(department) {
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
    await wait()
    return updated
}
async function removeDepartment(department) {
    const employeesInDepartment = await database.getDepartmentEmployees(department.id)
    if (employeesInDepartment.length > 0) {
        const { option } = await inquirer.prompt([{
            name: 'option',
            type: 'list',
            message: 'You have a number of employees in this department. What would you like to do with them?',
            prefix: '-',
            choices: [
                { name: 'Move them to another department.', value: switchDepartment },
                { name: 'Remove them as well.', value: desolveDepartment },
                { name: 'Leave them unasigned.', value: unasigneThem },
                separator,
                { name: 'Nevermind. Don\'t remove department.', value: null }
            ]
        }])
        if (option) option()
        else {
            console.log(`\x1b[31m  The department was not be removed.\x1b[0m`)
            return false
        }

        function switchDepartment() {
            const departments = (await database.getDepartments())
                .filter(record => record.name != department.name)
                .map(record => { return { name: record.name, value: record } })

            const { newDepartment } = await inquirer.prompt([{
                name: 'newDepartment',
                type: 'list',
                message: 'What department would you like to move them to?',
                prefix: '-',
                choices: departments
            }])

            const roles = (await database.getDepartmentRoles(newDepartment.id))
                .map(record => { return { name: record.title, value: record } })
            const newRole = roles.length = 0 ?
                
        }
        function desolveDepartment() { }
        function unasigneThem() { }
    }
    // const removed = await database.deleteDepartment(department.id)
    // console.log(removed ? 
    //     `\x1b[32m  ${department.name} was removed.\x1b[0m` :
    //     `\x1b[31m  The department could not be removed.\x1b[0m`)
    await wait()
    return removed
}

module.exports = { display, add }