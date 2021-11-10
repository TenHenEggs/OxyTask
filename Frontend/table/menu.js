const SubTask = require('./SubTask');

let tasks;
let tags;

const elements = {
    'addSub': document.getElementById('addSub'),
    'addSubButton': document.getElementById('addSubButton'),
    'cancelModification': document.getElementById('cancelModification'),
    'deleteTask': document.getElementById('deleteTask'),
    'depLabel': document.getElementById('depLabel'),
    'depPrototype': document.getElementById('depPrototype'),
    'deptasks': document.getElementById('deptasks'),
    'modalTaskDeletionButton': document.getElementById('modalTaskDeletionButton'),
    'modalTaskName': document.getElementById('modalTaskName'),
    'modifyTask': document.getElementById('modifyTask'),
    'subLabel': document.getElementById('subLabel'),
    'subtasks': document.getElementById('subtasks'),
    'tagLabel': document.getElementById('tagLabel'),
    'tags': document.getElementById('tags'),
    'taskMenu': document.getElementById('taskMenu'),
    'taskSearch': document.getElementById('taskSearch'),
    'taskSearchList': document.getElementById('taskSearchList')
}

function setup(task) {
    const form = document.taskModification;
    form.reset();
    [...form.elements].forEach(element => element.setAttribute('readonly', ''));

    form.name.value = (task.name === '') ? 'Brak nazwy' : task.name;
    form.description.value = (task.description === '') ? 'Brak opisu' : task.description;
    form.deadline.value = task.deadline;

    elements['addSub'].classList.add('d-none');
    elements['tagLabel'].classList.add('d-none');
    elements['subLabel'].classList.add('d-none');
    elements['depLabel'].classList.add('d-none');
    elements['taskSearch'].classList.add('d-none');
    elements['cancelModification'].classList.add('d-none');
    elements['modifyTask'].innerHTML = 'Edytuj zadanie';
    elements['modifyTask'].onclick = () => enterEditMode(task);
    elements['subtasks'].innerHTML = '';
    elements['deptasks'].innerHTML = '';
    elements['tags'].innerHTML = '';
    elements['taskMenu'].classList.remove('border-warning');
    elements['taskMenu'].classList.add('border-info');
    elements['taskSearchList'].innerHTML = '';

    elements['deleteTask'].onclick = () => {
        elements['modalTaskName'].innerHTML = task.name;
        elements['modalTaskDeletionButton'].onclick = () => {
            task.element.children[0].onclick(); // Hide the menu
            task.delete();
        }
    }

    if (task.tags.length > 0) elements['tagLabel'].classList.remove('d-none');
    if (task.subs.length > 0) elements['subLabel'].classList.remove('d-none');
    if (task.deps.length > 0) elements['depLabel'].classList.remove('d-none');

    task.tags.forEach(tag => {
        const element = tag.element.cloneNode(true);
        elements['tags'].append(element);
    });

    task.subs.forEach(sub => {
        sub.element.children[0].classList.remove('d-none');
        sub.element.children[0].children[0].checked = sub.completed;
        sub.element.children[2].value = sub.name;
        sub.element.children[1].classList.add('d-none');
        elements['subtasks'].append(sub.element);
    });

    task.deps.forEach(dep => {
        const element = elements['depPrototype'].children[0].cloneNode(true);
        element.children[0].classList.add('d-none');
        element.children[1].classList.add('text-' + dep.getListBasedColor());
        element.children[1].innerHTML = dep.searchElement.innerHTML;
        elements['deptasks'].append(element);
    });
}

function enterEditMode(task) {
    const form = document.taskModification;
    [...form.elements].forEach(element => element.removeAttribute('readonly'));

    form.name.value = task.name;
    form.description.value = task.description;

    const newTags = [...task.tags];
    const newSubs = [...task.subs];
    const newDeps = [...task.deps];

    elements['addSub'].classList.remove('d-none');
    elements['tagLabel'].classList.remove('d-none');
    elements['subLabel'].classList.remove('d-none');
    elements['depLabel'].classList.remove('d-none');
    elements['taskSearch'].classList.remove('d-none');
    elements['addSubButton'].onclick = () => addSubTask(task, form.newSubName.value, newSubs);
    elements['cancelModification'].classList.remove('d-none');
    elements['cancelModification'].onclick = () => setup(task);
    elements['modifyTask'].innerHTML = 'Zapisz zmiany';
    elements['modifyTask'].onclick = () => saveChanges(task, newSubs, newDeps, newTags);
    elements['taskMenu'].classList.add('border-warning');
    elements['taskMenu'].classList.remove('border-info');
    elements['taskSearch'].onfocus = () => search(task, newDeps);
    elements['taskSearch'].oninput = () => search(task, newDeps);

    elements['tags'].innerHTML = '';
    tags.forEach(tag => {
        if (task.tags.find(t => t.id === tag.id) !== undefined)
            elements['tags'].append(containedTagElement(tag, newTags));
        else
            elements['tags'].append(notContainedTagElement(tag, newTags));
    });

    task.subs.forEach(sub => {
        sub.element.children[0].classList.add('d-none');
        sub.element.children[1].classList.remove('d-none');
        sub.element.children[1].onclick = () => {
            elements['subtasks'].removeChild(sub.element);
            newSubs.splice(newSubs.indexOf(sub), 1);
        };
    });

    task.deps.forEach((dep, i) => {
        const depsElements = elements['deptasks'].children;
        depsElements[i].children[0].classList.remove('d-none');
        depsElements[i].children[0].onclick = () => {
            elements['deptasks'].removeChild(depsElements[newDeps.indexOf(dep)]);
            newDeps.splice(newDeps.indexOf(dep), 1);
        };
    });
}

function saveChanges(task, newSubs, newDeps, newTags) {
    const form = document.taskModification;
    task.name = form.name.value;
    task.description = form.description.value;
    task.deadline = form.deadline.value;
    task.tags.forEach(tag => tag.tasks.splice(tag.tasks.indexOf(task), 1));
    task.tags = [...newTags];
    task.subs = [...newSubs];
    task.deps = [...newDeps];
    task.subs.forEach(sub => sub.name = sub.element.children[2].value);
    task.tags.forEach(tag => tag.tasks.push(task));

    task.update();
    setup(task);
}

function containedTagElement(tag, tags) {
    const element = tag.element.cloneNode(true);
    element.children[0].classList.add('border', 'border-2', 'border-success');
    element.onmouseenter = () => {
        element.children[0].innerHTML = '-';
        element.children[0].classList.add('bg-danger');
    };
    element.onmouseleave = () => {
        element.children[0].innerHTML = tag.name;
        element.children[0].classList.remove('bg-danger');
    };
    element.onclick = () => {
        tags.splice(tags.indexOf(tag), 1);
        element.parentElement.replaceChild(notContainedTagElement(tag, tags), element);
    };
    return element;
}

function notContainedTagElement(tag, tags) {
    const element = tag.element.cloneNode(true);
    element.children[0].classList.add('border', 'border-2', 'border-danger');
    element.onmouseenter = () => {
        element.children[0].innerHTML = '+';
        element.children[0].classList.add('bg-success');
    };
    element.onmouseleave = () => {
        element.children[0].innerHTML = tag.name;
        element.children[0].classList.remove('bg-success');
    };
    element.onclick = () => {
        tags.push(tag);
        element.parentElement.replaceChild(containedTagElement(tag, tags), element);
    };
    return element;
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

function addDepTask(dep, deps) {
    deps.push(dep);
    const element = elements['depPrototype'].children[0].cloneNode(true);
    element.children[1].innerHTML = dep.searchElement.innerHTML;
    elements['deptasks'].append(element);
    element.children[0].onclick = () => {
        elements['deptasks'].removeChild(element);
        deps.splice(deps.indexOf(dep), 1);
    };
    element.children[1].classList.add('text-' + dep.getListBasedColor());
    document.taskModification.taskSearch.value = '';
}

function search(editedTask, deps) {
    const text = document.taskModification.taskSearch.value.toLowerCase();
    elements['taskSearchList'].innerHTML = '';
    tasks.forEach(task => {
        if (editedTask.id === task.id) return;
        if (task.searchElement.innerHTML.toLowerCase().search(text) === -1) return;
        for (let i = 0; i < deps.length; ++i)
            if (task.id === deps[i].id) return;
        elements['taskSearchList'].append(task.searchElement);
        task.searchElement.onmousedown = () => addDepTask(task, deps);
    });
}

function stopSearch() {
    elements['taskSearchList'].innerHTML = '';
}

elements['taskSearch'].onblur = () => stopSearch();

function setTaskArray(taskArray) {
    tasks = taskArray;
}

function setTagArray(tagArray) {
    tags = tagArray;
}

module.exports = {
    setup: setup,
    setTaskArray: setTaskArray,
    setTagArray: setTagArray
}
