const {inquirer, database, separator, wait, displayTable} = require('./global')

const departmentOptions = [
    {name: '\x1b[94mUpdate name\x1b[0m', value: updateDepartmentName},
    {name: '\x1b[91mRemove department\x1b[0m', value: removeDepartment},
    separator,
    {name: 'Nothing', value: null}
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
        const {action} = await inquirer.prompt([{
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
    
}
async function removeDepartment(department) {}

module.exports = { display, add }