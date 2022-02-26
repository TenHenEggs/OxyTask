const utilities = require('../utilities');
const modals = require('./modals');
const alert = require('../alert');
const tasks = require('./tasks');
const menu = require('./menu');
const tags = require('./tags');

const table = JSON.parse(sessionStorage.getItem('table'));

function createTask() {
  const form = document.createTaskModalForm;
  const value = utilities.serializeForm(form);
  utilities.request('/api/tables/' + table.id + '/tasks/', 'POST', value)
    .then(res => {
      value.id = res.id; //TODO wait for backend to decide upon 'res' or 'res.id'
      value.list = 0;
      tasks.create(value, menu);
    })
    .catch(err => alert(err));
  form.reset();
}

function createTag() {
  const form = document.createTagModalForm;
  const value = utilities.serializeForm(form);
  if (value.name === '') return;
  utilities.request('/api/tables/' + table.id + '/tags/', 'POST', value)
    .then(res => {
      value.id = res; //TODO wait for backend to decide upon 'res' or 'res.id'
      tags.create(value);
    })
    .catch(err => alert(err));
  form.reset();
}

function deleteTable(id) {
  utilities.request('/api/tables/' + id, 'DELETE')
    .then(_ => goBack())
    .catch(err => alert(err));
}

function fetchTags() {
  utilities.request('/api/tables/' + table.id + '/tags/', 'GET')
    .then(res => res.forEach(tag => {
      tag.color = '#000000'; //TODO wait for backend to FIX
      tags.create(tag);
    }))
    .catch(err => alert(err));
}

function fetchTasks() {
  utilities.request('/api/tables/' + table.id + '/tasks/', 'GET')
    .then(res => {
      res.forEach(task => {
        tasks.create({
          id: task.id
        }, menu);
      });
      res.forEach((task, i) => tasks.list[i].deserialize(task));
    })
    .catch(err => alert(err));
}

function goBack() {
  sessionStorage.removeItem('table');
  location.href = '../menu/index.html';
}

document.getElementById('back').onclick = goBack;
document.getElementById('menuButton').onclick = _ => menu.toggle();

document.getElementById('tableName').innerHTML = table.name;

document.getElementById('createTagButton').onclick = _ => modals.createTag.show();
document.getElementById('createTagModalButton').onclick = createTag;

document.getElementById('createTaskButton').onclick = _ => modals.createTask.show();
document.getElementById('createTaskModalButton').onclick = createTask;

document.getElementById('deleteTableButton').onclick = _ => modals.deleteTable.show();
document.getElementById('deleteTableModalTableName').innerHTML = table.name;
document.getElementById('deleteTableModalButton').onclick = _ => deleteTable(table.id);

fetchTags();
fetchTasks();
