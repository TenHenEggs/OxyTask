const utilities = require('./utilities.js');

let tables = [];

function openTable(id) {
    sessionStorage.tableId = id;
    location.href = 'table/index.html';
}

function setupModal(table) {
    document.getElementById('modalTableName').innerHTML = table.name;
    document.getElementById('modalDeleteButton').onclick = () => deleteTable(table.id);
}

function addTableButton(table) {
    let tableButton = document.createElement('button');
    tableButton.type = 'button';
    tableButton.classList = 'btn btn-outline-light p-3 text-center w-100 overflow-hidden';
    tableButton.onclick = () => openTable(table.id);
    tableButton.innerHTML = table.name;

    let buttonCol = document.createElement('div');
    buttonCol.classList = 'col';
    buttonCol.append(tableButton);

    let deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList = 'btn btn-outline-danger w-100 h-100 p-0';
    deleteButton.setAttribute('data-bs-toggle', 'modal');
    deleteButton.setAttribute('data-bs-target', '#tableDeletionModal');
    deleteButton.onclick = () => setupModal(table);
    deleteButton.innerHTML = 'x';

    let deleteCol = document.createElement('div');
    deleteCol.classList = 'col-1 d-none';
    deleteCol.append(deleteButton);

    let row = document.createElement('div');
    row.classList = 'row w-100 g-0';
    row.onmouseenter = () => {
        row.firstElementChild.classList.remove('col');
        row.firstElementChild.classList.add('col-11');
        row.lastElementChild.classList.remove('d-none');
    };
    row.onmouseleave = () => {
        row.firstElementChild.classList.remove('col-11');
        row.firstElementChild.classList.add('col');
        row.lastElementChild.classList.add('d-none');
    };
    row.append(buttonCol);
    row.append(deleteCol);

    let finalCol = document.createElement('div');
    finalCol.id = 'table_' + table.id;
    finalCol.classList = 'col';
    finalCol.append(row);

    document.getElementById('tables').append(finalCol);
}

function fetchTables() {
    utilities.request('/api/tables', 'GET').then(res => {
        tables = res;
        tables.forEach(addTableButton);
    }).catch(err => console.log(err));
}

function deleteTable(id) {
    utilities.request('/api/tables/' + id, 'DELETE').then(() => {
        document.getElementById('tables').removeChild(document.getElementById('table_' + id));
    }).catch(err => console.log(err));
}

function createTable() {
    let table = {};
    table.name = document.modalNewTable.tableName.value;
    utilities.request('/api/tables', 'POST', {
        'name': table.name
    }).then(res => {
        if (res.id === undefined) throw new Error('Invalid response from server');
        table.id = res.id;
        addTableButton(table);
    }).catch(err => console.log(err));
    document.modalNewTable.reset();
}

fetchTables();
document.getElementById('modalCreationButton').onclick = () => createTable();
