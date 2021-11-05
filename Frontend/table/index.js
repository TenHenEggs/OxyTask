const utilities = require('../utilities.js');
const Task = require('./Task.js');

//TODO remove
require('./generateTasks.js');

const elements = {
    'back': document.getElementById('back')
}

function createTask() {
    const form = document.modalNewTask;
    new Task(form.name.value, form.description.value, form.deadline.value);
    form.reset();
}

function deleteTable(id) {
    utilities.deleteTable(id).then(() => {
        elements['back'].onclick();
    }).catch(err => console.log(err));
}

const table = JSON.parse(sessionStorage.getItem('table'));
document.getElementById('tableName').innerHTML = table.name;
document.getElementById('modalTableName').innerHTML = table.name;
document.getElementById('modalTaskCreationButton').onclick = () => createTask();
document.getElementById('modalTableDeletionButton').onclick = () => deleteTable(table.id);
