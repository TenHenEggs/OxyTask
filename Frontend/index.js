const server = 'http://localhost:8080';
let tables = [];

function openTable(id) {
    sessionStorage.tableId = id;
    location.href = 'table.html';
}

function setupModal(table) {
    document.getElementById('modalTableName').innerHTML = table.name;
    document.getElementById('modalDeleteButton').onclick = () => deleteTable(table.id);
}

function addTableButton(table) {
    let tableButton = document.createElement('button');
    tableButton.type = 'button';
    tableButton.classList = 'btn btn-outline-light p-3 text-center w-100';
    tableButton.onclick = () => openTable(table.id);
    tableButton.innerHTML = table.name;

    let buttonCol = document.createElement('div');
    buttonCol.classList = 'col';
    buttonCol.appendChild(tableButton);

    let deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.classList = 'btn btn-outline-danger w-100 h-100 p-0';
    deleteButton.setAttribute('data-bs-toggle', 'modal');
    deleteButton.setAttribute('data-bs-target', '#tableDeletionModal');
    deleteButton.onclick = () => setupModal(table);
    deleteButton.innerHTML = 'x';

    let deleteCol = document.createElement('div');
    deleteCol.classList = 'col-1 d-none';
    deleteCol.appendChild(deleteButton);

    let row = document.createElement('div');
    row.classList = 'row w-100 g-0';
    row.onmouseenter = () => {row.lastChild.classList.remove('d-none');};
    row.onmouseleave = () => {row.lastChild.classList.add('d-none');};
    row.appendChild(buttonCol);
    row.appendChild(deleteCol);

    let finalCol = document.createElement('div');
    finalCol.id = 'table_' + table.id;
    finalCol.classList = 'col';
    finalCol.appendChild(row);

    document.getElementById('tables').appendChild(finalCol);
}

function request(url, method, body) {
    return fetch(server + url, {
        method: method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(res => {
        if(res.status != 200) throw new Error('Request failed with code ' + res.status);
        return res.json();
    });
}

function fetchTables() {
    request('/api/tables', 'GET').then(res => {
        tables = res;
        res.forEach(addTableButton);
    }).catch(err => console.log(err));
}

function deleteTable(id) {
    request('/api/tables/' + id, 'DELETE').then(() => {
        document.getElementById('tables').removeChild(document.getElementById('table_' + id));
    }).catch(err => console.log(err));
}

function createTable() {
    let table = {};
    table.name = document.getElementById('modalNewTableName').value;
    request('/api/tables', 'POST', {
        'name': table.name
    }).then(res => {
        if(res.id == undefined) throw new Error('Invalid response from server');
        table.id = res.id;
        addTableButton(table);
    }).catch(err => console.log(err));
    document.getElementById('modalNewTableName').value = '';
}

fetchTables();
document.getElementById('modalCreationButton').onclick = () => createTable();
