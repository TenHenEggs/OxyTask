const menu = require('./menu.js');

const elements = {
    'lists': document.getElementById('lists'),
    'menu': document.getElementById('menu'),
    'taskMenu': document.getElementById('taskMenu')
};

let visibleMenu = 'none';

function toggleMenu() {
    if (visibleMenu === 'menu') {
        elements['menu'].classList.add('d-none');
        elements['lists'].classList = 'h-100 col';
        visibleMenu = 'none';
    } else {
        elements['menu'].classList.remove('d-none');
        elements['lists'].classList = 'h-100 d-none d-sm-block col-sm-6 col-md-8 col-xl-9 col-xxl-10';
        elements['taskMenu'].classList.add('d-none');
        visibleMenu = 'menu';
    }
}

function toggleTaskMenu(task) {
    if (visibleMenu.id === task.id) {
        elements['taskMenu'].classList.add('d-none');
        elements['lists'].classList = 'h-100 col';
        visibleMenu = 'none';
    } else {
        elements['taskMenu'].classList.remove('d-none');
        elements['lists'].classList = 'h-100 d-none d-sm-block col-sm-6 col-md-8 col-xl-9 col-xxl-10';
        elements['menu'].classList.add('d-none');
        visibleMenu = task;
        menu.setup(task);
    }
}

function goBack() {
    sessionStorage.removeItem('table');
    location.href = '../menu/index.html';
}

document.getElementById('back').onclick = () => goBack();
document.getElementById('menuButton').onclick = () => toggleMenu();

module.exports.registerTask = function(task) {
    task.element.children[0].onclick = () => toggleTaskMenu(task);
}

module.exports.setup = function(taskArray) {
    menu.setTaskArray(taskArray);
}
