const utilities = require('../utilities');
const Subtask = require('./Subtask');
const modals = require('./modals');
const alert = require('../alert');
const tasks = require('./tasks');
const tags = require('./tags');

const table = JSON.parse(sessionStorage.getItem('table'));

const taskMenuElement = document.getElementById('taskMenu');
const taskTagsElement = document.getElementById('taskTags');
const editTagsElement = document.getElementById('editTags');
const subtasksElement = document.getElementById('subtasks');
const depedenciesElement = document.getElementById('depedencies');
const taskSearchListElement = document.getElementById('taskSearchList');

const mainElement = document.getElementById('lists').parentElement;
const form = document.taskEditing;

let task;
let newSubtasks;
let newDepedencies;

function toggle(newTask) {
  task = newTask;
  const current = mainElement.getAttribute('menu');
  const target = task ? task.id.toString() : 'menu';
  if (current === target) mainElement.setAttribute('menu', 'none');
  else {
    mainElement.setAttribute('menu', target);
    if (task) setup(task);
  }
}

function setup() {
  form.reset();
  form.setAttribute('readonly', '');

  form.name.setAttribute('readonly', '');
  form.description.setAttribute('readonly', '');
  form.deadline.setAttribute('readonly', '');
  for (let i = 0; i < subtasksElement.children.length; ++i)
    subtasksElement.children[i].children[2].setAttribute('readonly', '');

  form.name.value = (task.name === '') ? 'Brak nazwy' : task.name;
  form.description.value = (task.description === '') ? 'Brak opisu' : task.description;
  form.deadline.value = task.deadline;

  taskMenuElement.classList.remove('border-warning');
  taskMenuElement.classList.add('border-info');

  taskTagsElement.replaceChildren(...task.tagsElement.cloneNode(true).children);
  subtasksElement.replaceChildren(...task.subtasksElements);
  depedenciesElement.innerHTML = '';
  task.depedencies.forEach(dep => depedenciesElement.append(dep.depedencyElement));
}

function enterEditMode() {
  form.removeAttribute('readonly');
  form.name.removeAttribute('readonly');
  form.description.removeAttribute('readonly');
  form.deadline.removeAttribute('readonly');

  form.name.value = task.name;
  form.description.value = task.description;

  newSubtasks = [];
  newDepedencies = [...task.depedencies];

  subtasksElement.innerHTML = '';
  task.subtasks.forEach(subtask => addSubtask(subtask));

  tags.list.forEach((tag, i) => {
    if (task.tags.find(t => t.id === tag.id) === undefined)
      editTagsElement.children[i].children[0].setAttribute('unused', '');
    else
      editTagsElement.children[i].children[0].removeAttribute('unused');
  });

  taskMenuElement.classList.add('border-warning');
  taskMenuElement.classList.remove('border-info');
}

function saveChanges() {
  const old = Object.assign({}, task);
  const form = document.taskEditing;
  task.name = form.name.value;
  task.description = form.description.value;
  task.deadline = form.deadline.value;
  task.depedencies = [...newDepedencies];
  task.subtasks = [];
  task.subtasksElements = [];

  newSubtasks.forEach((subtask, i) => {
    subtask.name = subtasksElement.children[i].children[2].value;
    subtask.bindElementToTask(subtask.generateElement(), task);
  });

  tags.list.forEach((tag, i) => {
    const element = editTagsElement.children[i].children[0];
    const former = +(task.tags.find(t => t.id === tag.id) === undefined);
    if (+(element.getAttribute('unused') == '') !== former) {
      if (former === 0) tag.removeFromTask(task);
      else tag.addToTask(task);
    }
  });

  utilities.request('/api/tables/' + table.id + '/tasks/' + task.id, 'PUT', task.serialize())
    .then(_ => task.update())
    // .catch(err => {  TODO backend...
    //   Object.assign(task, old);
    //   alert(err);
    // });
  setup();
}

function addSubtask(data) {
  const subtask = new Subtask(data);
  newSubtasks.push(subtask);
  subtasksElement.append(subtask.generateElement(_ => {
    const index = newSubtasks.indexOf(subtask);
    newSubtasks.splice(index, 1);
    subtasksElement.children[index].remove();
  }));
}

function addDepedency(dep) {
  newDepedencies.push(dep);
  depedenciesElement.append(dep.depedencyElement);
  document.taskEditing.taskSearch.value = '';
}

function removeDepedency(dep) {
  dep.depedencyElement.remove();
  newDepedencies.splice(newDepedencies.indexOf(dep), 1);
}

function search() {
  abortSearch();
  const text = document.taskEditing.taskSearch.value.toLowerCase();
  tasks.list.forEach(t => {
    if (task.id === t.id) return;
    if (t.searchElement.innerHTML.toLowerCase().search(text) === -1) return;
    if (newDepedencies.find(d => t.id === d.id) !== undefined) return;
    taskSearchListElement.append(t.searchElement);
  });
}

function abortSearch() {
  taskSearchListElement.innerHTML = '';
}

document.getElementById('enterEditModeButton').onclick = enterEditMode;
document.getElementById('saveChangesButton').onclick = saveChanges;
document.getElementById('cancelEditButton').onclick = setup;
document.getElementById('taskSearch').onfocus = search;
document.getElementById('taskSearch').oninput = search;
document.getElementById('taskSearch').onblur = abortSearch;

document.getElementById('deleteTaskButton').onclick = _ => {
  document.getElementById('deleteTaskModalTaskName').innerHTML = task.name;
  modals.deleteTask.show();
};

document.getElementById('deleteTaskModalButton').onclick = _ => {
  task.delete();
  toggle(task);
};

document.getElementById('addSubButton').onclick = _ => {
  addSubtask({
    name: form.newSubtaskName.value
  }, newSubtasks);
  form.newSubtaskName.value = '';
};

module.exports = {
  toggle: toggle,
  addDepedency: addDepedency,
  removeDepedency: removeDepedency
};
