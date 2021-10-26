const utilities = require('./utilities.js');

function goBack() {
    sessionStorage.tableId = undefined;
    location.href = 'index.html';
}

document.getElementById('back').onclick = () => goBack();
