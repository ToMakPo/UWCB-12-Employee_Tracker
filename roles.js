const {inquirer, database, separator, wait, displayTable} = require('./global')

async function display() {}

async function add() {}

const roleOptions = [
    {name: '\x1b[94mUpdate Title\x1b[0m', value: updateTitle},
    {name: '\x1b[94mUpdate Department\x1b[0m', value: updateDepartment},
    {name: '\x1b[91mRemove Role\x1b[0m', value: remove},
    separator,
    {name: 'Nothing', value: null}
]
async function updateTitle(role) {}
async function updateDepartment(role) {}
async function remove(role) {}

module.exports = { display, add }