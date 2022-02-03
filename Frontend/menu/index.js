const utilities = require('../utilities');
const alert = require('../alert');
const Table = require('./Table');
const modals = require('./modals');

function showCreateModal() {
  document.createModalForm.reset();
  modals.create.show();
  document.createModalForm.name.focus();
}

function createTable() {
  const name = document.createModalForm.name.value;
  utilities.request('/api/tables', 'POST', utilities.serializeForm(document.createModalForm))
    .then(res => new Table(name, res))
    .catch(err => alert(err));
}

function fetchTables() {
  utilities.request('/api/tables', 'GET')
    .then(res => res.forEach(table => new Table(table.name, table.id)))
    .catch(err => alert(err));
}

fetchTables();
document.getElementById('createModalButton').onclick = () => createTable();
document.getElementById('new').onclick = () => showCreateModal();
