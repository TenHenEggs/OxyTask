const utilities = require('../utilities');
const templates = require('./templates');
const modals = require('./modals');
const alert = require('../alert');

const tables = [];
const tablesElements = [];

const storage = document.getElementById('tables');

const tableName = document.getElementById('deleteModalTableName');
const deleteButton = document.getElementById('deleteModalButton');

class Table {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    tables.push(this);
    tablesElements.push(this.generateElement());
    storage.append(tablesElements.at(-1));
  }

  generateElement() {
    const div = templates.table();
    const row = div.children[0];
    const button = row.children[0].children[0];
    button.onclick = _ => this.open();
    button.innerHTML = this.name;
    const deleteCol = row.children[1];
    deleteCol.children[0].onclick = _ => this.showDeleteModal();
    return div;
  }

  open() {
    sessionStorage.setItem('table', JSON.stringify(this));
    location.href = '../table/index.html';
  }

  showDeleteModal() {
    tableName.innerHTML = this.name;
    deleteButton.onclick = _ => this.delete();
    modals.delete.show();
  }

  delete() {
    utilities.request('/api/tables/' + this.id, 'DELETE').then(_ => {
      const index = tables.findIndex(table => table.id === this.id);
      storage.children[index].remove();
      tables.splice(index, 1);
      tablesElements.splice(index, 1);
    }).catch(err => alert(err));
  }
}

module.exports = Table;
