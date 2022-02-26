const utilities = require('../utilities');
const modals = require('./modals');
const alert = require('../alert');
const Table = require('./Table');

function showCreateModal() {
  modals.create.show();
  document.createModalForm.name.focus();
}

function createTable() {
  const name = document.createModalForm.name.value;
  if (name === '') return;
  utilities.request('/api/tables/', 'POST', utilities.serializeForm(document.createModalForm))
    .then(res => new Table(name, res))
    .catch(err => alert(err));
  document.createModalForm.reset();
}

function fetchTables() {
  utilities.request('/api/tables/', 'GET')
    .then(res => res.forEach(table => new Table(table.name, table.id)))
    .catch(err => alert(err));
}

document.getElementById('createModalButton').onclick = createTable;
document.getElementById('new').onclick = showCreateModal;
fetchTables();
