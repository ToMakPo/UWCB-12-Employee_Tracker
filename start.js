const {inquirer, database, separator} = require('./global')
const employees = require('./employees')
const departments = require('./departments')

async function start() {
    console.clear()
    printHeader()
    const action = await promptUserForInitialAction()

    if (action) {
        await action()
        await start()
    } else {
        quit()
    }
}

function printHeader() {
    let header = []   
    header.push("╔════════════════════════════════╗")
    header.push("║    ┌─╴┌╮╮┌─╮╷  ╭─╮╷ ╷┌─╴┌─╴    ║")
    header.push("║    ├╴ │││├─╯│  │ │╰┬╯├╴ ├╴     ║")
    header.push("║    └─╴╵ ╵╵  └─╴╰─╯ ╵ └─╴└─╴    ║")
    header.push("║     ┌╮╮╭─╮┌╮╷╭─╮╭─╮┌─╴┌─╮      ║")
    header.push("║     │││├─┤│││├─┤│ ┐├─ ├┬╯      ║")
    header.push("║     ╵ ╵╵ ╵╵╰┘╵ ╵╰─╯└─╴╵╰─      ║")
    header.push("╚════════════════════════════════╝")
    console.log(header.join('\n'));
}

const initialAction = [
    {name: '\x1b[94mView Employees\x1b[0m', value: employees.display},
    {name: '\x1b[94mView Employees by Department\x1b[0m', value: employees.displayByDepartment},
    {name: '\x1b[94mView Employees by Manager\x1b[0m', value: employees.displayByManager},
    {name: '\x1b[92mAdd Employee\x1b[0m', value: employees.add},
    separator,
    {name: '\x1b[94mView Departments\x1b[0m', value: departments.display},
    {name: '\x1b[92mAdd Department\x1b[0m', value: departments.add},
    separator,
    {name: 'Quit', value: null}
]

async function promptUserForInitialAction() {
    const {action} = await inquirer.prompt([{
        name: 'action',
        type: 'list',
        message: 'What would you like to do?',
        prefix: '-',
        choices: initialAction,
        pageSize: 99
    }])
    return action
}

function quit() {
    database.closeConnection()
    console.log('- Have a nice day!')
}

module.exports = start