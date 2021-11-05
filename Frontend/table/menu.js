const SubTask = require('./SubTask');

const elements = {
    'addSub': document.getElementById('addSub'),
    'addSubButton': document.getElementById('addSubButton'),
    'cancelModification': document.getElementById('cancelModification'),
    'deleteTask': document.getElementById('deleteTask'),
    'modalTaskDeletionButton': document.getElementById('modalTaskDeletionButton'),
    'modalTaskName': document.getElementById('modalTaskName'),
    'modifyTask': document.getElementById('modifyTask'),
    'taskMenu': document.getElementById('taskMenu'),
    'subtasks' : document.getElementById('subtasks')
}

function setup(task) {
    const form = document.taskModification;
    form.reset();
    [...form.elements].forEach(element => element.setAttribute('readonly', ''));

    form.name.value = (task.name === '') ? 'Brak nazwy' : task.name;
    form.description.value = (task.description === '') ? 'Brak opisu' : task.description;
    form.deadline.value = task.deadline;

    elements['addSub'].classList.add('d-none');
    elements['cancelModification'].classList.add('d-none');
    elements['modifyTask'].innerHTML = 'Edytuj zadanie';
    elements['modifyTask'].onclick = () => enterEditMode(task);
    elements['subtasks'].innerHTML = '';
    elements['taskMenu'].classList.remove('border-warning');
    elements['taskMenu'].classList.add('border-info');

    elements['deleteTask'].onclick = () => {
        elements['modalTaskName'].innerHTML = task.name;
        elements['modalTaskDeletionButton'].onclick = () => {
            task.element.children[0].onclick(); // Hide the menu
            task.delete();
        }
    }

    task.subs.forEach(sub => {
        sub.element.children[0].classList.remove('d-none');
        sub.element.children[0].children[0].checked = sub.completed;
        sub.element.children[2].value = sub.name;
        sub.element.children[1].classList.add('d-none');
        elements['subtasks'].append(sub.element);
    });
}

function enterEditMode(task) {
    const form = document.taskModification;
    [...form.elements].forEach(element => element.removeAttribute('readonly'));

    form.name.value = task.name;
    form.description.value = task.description;

    const newSubs = [...task.subs];

    elements['addSub'].classList.remove('d-none');
    elements['addSubButton'].onclick = () => addSubTask(task, form.newSubName.value, newSubs);
    elements['cancelModification'].classList.remove('d-none');
    elements['cancelModification'].onclick = () => setup(task);
    elements['modifyTask'].innerHTML = 'Zapisz zmiany';
    elements['modifyTask'].onclick = () => saveChanges(task, newSubs);
    elements['taskMenu'].classList.add('border-warning');
    elements['taskMenu'].classList.remove('border-info');

    task.subs.forEach(sub => {
        sub.element.children[0].classList.add('d-none');
        sub.element.children[1].classList.remove('d-none');
        sub.element.children[1].onclick = () => {
            elements['subtasks'].removeChild(sub.element);
            newSubs.splice(newSubs.indexOf(sub), 1);
        };
    });
}

function saveChanges(task, newSubs) {
    const form = document.taskModification;
    task.name = form.name.value;
    task.description = form.description.value;
    task.deadline = form.deadline.value;
    task.subs = [...newSubs];
    task.subs.forEach(sub => sub.name = sub.element.children[2].value);

    task.update();
    setup(task);
}

function addSubTask(task, name, subs) {
    const sub = new SubTask(name);
    subs.push(sub);
    elements['subtasks'].append(sub.element);
    sub.element.children[0].classList.add('d-none');
    sub.element.children[0].children[0].onchange = () => {
        sub.completed = sub.element.children[0].children[0].checked;
        task.update();
    }
    sub.element.children[1].onclick = () => {
        elements['subtasks'].removeChild(sub.element);
        subs.splice(subs.indexOf(sub), 1);
    };

    document.taskModification.newSubName.value = '';
}

module.exports = {
    setup: setup
}
