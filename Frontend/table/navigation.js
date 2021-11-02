let menu = document.getElementById('menu');
let taskMenu = document.getElementById('taskMenu');
let lists = document.getElementById('lists');
let menuButton = document.getElementById('menuButton');

let visibleMenu = 'none';

function goBack() {
    sessionStorage.tableId = undefined;
    location.href = '../index.html';
}

function toggleMenu() {
    if (visibleMenu === 'none') {
        menu.classList.remove('d-none');
        lists.classList = 'h-100 d-none d-sm-block col-sm-6 col-md-8 col-xl-9 col-xxl-10';
        visibleMenu = 'menu';
    } else if (visibleMenu === 'menu') {
        menu.classList.add('d-none');
        lists.classList = 'h-100 col';
        visibleMenu = 'none';
    } else {
        taskMenu.classList.add('d-none');
        menu.classList.remove('d-none');
        visibleMenu = 'menu';
    }
}

function setupMenu(id, callback) {
    taskMenu.innerHTML = '';
    callback(id);
}

function toggleTaskMenu(id, callback) {
    if (visibleMenu === 'none') {
        setupMenu(id, callback);
        taskMenu.classList.remove('d-none');
        lists.classList = 'h-100 d-none d-sm-block col-sm-6 col-md-8 col-xl-9 col-xxl-10';
        visibleMenu = id;
    } else if (visibleMenu === id) {
        taskMenu.classList.add('d-none');
        lists.classList = 'h-100 col';
        visibleMenu = 'none';
    } else if (visibleMenu === 'menu') {
        setupMenu(id, callback);
        menu.classList.add('d-none');
        taskMenu.classList.remove('d-none');
        visibleMenu = id;
    } else {
        setupMenu(id, callback);
        visibleMenu = id;
    }
}

menuButton.onclick = () => toggleMenu();
document.getElementById('back').onclick = () => goBack();

module.exports.registerTask = function(task, callback) {
    let button = task.htmlElement.firstElementChild;
    button.onclick = () => toggleTaskMenu(task.id, callback);
}
