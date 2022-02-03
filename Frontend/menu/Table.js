const utilities = require('../utilities.js');
const modals = require('./modals');

const template = utilities.elementFromString(`
  <div class="col">
    <div class="row w-100 g-0">
      <div class="col">
        <button type="button" class="btn btn-outline-light p-3 rounded-start text-center w-100 overflow-hidden"></button>
      </div>
      <div class="col-1 d-none">
        <button type="button" class="btn btn-outline-danger rounded-0 rounded-end w-100 h-100 p-0">
          x
        </button>
      </div>
    </div>
  </div>
`);

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
    const div = template.cloneNode(true);
    const row = div.children[0];
    const button = row.children[0].children[0];
    button.onclick = () => this.open();
    button.innerHTML = this.name;
    const deleteCol = row.children[1];
    deleteCol.children[0].onclick = () => this.showDeleteModal();
    row.onmouseenter = () => {
      deleteCol.classList.remove('d-none');
      button.classList.add('rounded-0');
    };
    row.onmouseleave = () => {
      deleteCol.classList.add('d-none');
      button.classList.remove('rounded-0');
    };
    return div;
  }

  open() {
    sessionStorage.setItem('table', JSON.stringify(this));
    location.href = '../table/index.html';
  }

  showDeleteModal() {
    tableName.innerHTML = this.name;
    deleteButton.onclick = () => this.delete();
    modals.delete.show();
  }

  delete() {
    utilities.request('/api/tables/' + this.id, 'DELETE').then(() => {
      const index = tables.findIndex(table => table.id === this.id);
      storage.removeChild(tablesElements[index]);
      tables.splice(index, 1);
      tablesElements.splice(index, 1);
    }).catch(err => alert(err));
  }
}

module.exports = Table;
