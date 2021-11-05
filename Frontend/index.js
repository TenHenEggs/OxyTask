const utilities = require('./utilities.js');

const elements = {
    'modalCreationButton': document.getElementById('modalCreationButton'),
    'modalDeletionButton': document.getElementById('modalDeletionButton'),
    'modalTableName': document.getElementById('modalTableName'),
    'modalTitle': document.getElementById('modalTitle'),
    'prototype': document.getElementById('prototype'),
    'tables': document.getElementById('tables')
};

const tables = [];

class Table {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.generateElement();
        elements['tables'].append(this.element);
        tables.push(this);
    }

    generateElement() {
        const div = elements['prototype'].children[0].cloneNode(true);
        const row = div.children[0];
        const button = row.children[0].children[0];
        button.onclick = () => this.open();
        button.innerHTML = this.name;
        const deleteCol = row.children[1];
        deleteCol.children[0].onclick = () => this.setupModalForDeletion();
        row.onmouseenter = () => {
            deleteCol.classList.remove('d-none');
            button.classList.add('rounded-0');
        };
        row.onmouseleave = () => {
            deleteCol.classList.add('d-none');
            button.classList.remove('rounded-0');
        };
        this.element = div;
    }

    open() {
        this.element = undefined;
        sessionStorage.setItem('table', JSON.stringify(this));
        location.href = 'table/index.html';
    }

    setupModalForDeletion() {
        elements['modalTitle'].innerHTML = 'Usuwanie tablicy';
        elements['modalTableName'].innerHTML = this.name;
        elements['modalTableName'].parentElement.classList.remove('d-none');
        elements['modalCreationButton'].classList.add('d-none');
        elements['modalDeletionButton'].classList.remove('d-none');
        elements['modalDeletionButton'].onclick = () => this.delete();
        document.modal.classList.add('d-none');
    }

    delete() {
        utilities.deleteTable(this.id).then(() => {
            elements['tables'].removeChild(this.element);
            tables.splice(tables.findIndex(table => table.id === this.id), 1);
        }).catch(err => console.log(err));
    }
}

function setupModalForCreation() {
    elements['modalTitle'].innerHTML = 'Tworzenie tablicy';
    elements['modalTableName'].parentElement.classList.add('d-none');
    elements['modalDeletionButton'].classList.add('d-none');
    elements['modalCreationButton'].classList.remove('d-none');
    document.modal.tableName.focus();
    document.modal.classList.remove('d-none');
    document.modal.reset();
}

function createTable() {
    tableName = document.modal.tableName.value;
    utilities.request('/api/tables', 'POST', {
            'name': tableName
        })
        .then(res => tables.push(new Table(tableName, res.id)))
        .catch(err => console.log(err));
}

function fetchTables() {
    utilities.request('/api/tables', 'GET')
        .then(res => res.forEach(table => new Table(table.name, table.id)))
        .catch(err => console.log(err));
}

fetchTables();
elements['modalCreationButton'].onclick = () => createTable();
document.getElementById('new').onclick = () => setupModalForCreation();
