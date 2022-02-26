const utilities = require('../utilities');
const dragLogic = require('./dragLogic');
const templates = require('./templates');
const Subtask = require('./Subtask');
const alert = require('../alert');
const lists = require('./lists');
const tags = require('./tags');

const table = JSON.parse(sessionStorage.getItem('table'));

const tasks = [];

class Task {
  constructor(data, menu) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.deadline = data.deadline ? data.deadline : '';
    this.list = data.list ? data.list : 0;

    this.element = templates.task(this);
    this.element.children[0].onclick = _ => menu.toggle(this);
    this.searchElement = templates.taskSearch(this);
    this.searchElement.onmousedown = _ => menu.addDepedency(this);

    this.subtasks = data.subtasks ? data.subtasks : [];
    this.subtasksElements = [];

    this.tags = data.tags ? data.tags : [];
    this.tagsElement = this.element.children[0].children[2];

    this.depedencies = data.depedencies ? data.depedencies : [];
    this.depedencyElement = templates.depedency(this);
    this.depedencyElement.children[0].onclick = _ => menu.removeDepedency(this);

    this.update();
    tasks.push(this);
    dragLogic.registerTask(this);
    lists[this.list].prepend(this.element);
  }

  getDeadlineBasedColor() {
    if (this.deadline === '') return 'primary';

    let today = new Date();
    today.setHours(0, 0, 0, 0);
    today = today.getTime();

    let deadline = new Date(this.deadline);
    deadline.setHours(0, 0, 0, 0);
    deadline = deadline.getTime();

    if (deadline > today) return 'success';
    if (deadline === today) return 'warning';
    if (deadline < today) return 'danger';
  }

  getListBasedColor() {
    switch (this.list) {
      case 0:
        return 'secondary';
      case 1:
        return 'danger';
      case 2:
      case 3:
        return 'warning';
      case 4:
        return 'success';
    }
  }

  update() {
    const color = this.getDeadlineBasedColor();
    const button = this.element.children[0];
    button.children[0].children[0].innerHTML = this.name;
    button.classList.replace(button.classList[0], 'btn-outline-' + color);

    const depClasses = this.depedencyElement.children[1].classList;
    const newColor = 'text-' + this.getListBasedColor();
    if (depClasses[0] !== newColor) {
      depClasses.replace(depClasses[0], newColor);
      tasks.forEach(task => task.updateDeps());
    }

    this.depedencyElement.children[1].innerHTML = this.name + '#' + this.id;
    this.searchElement.innerHTML = this.name + '#' + this.id;
    this.updateDeps();
    this.updateProgress();
  }

  updateDeps() {
    const button = this.element.children[0];
    button.classList.remove('opacity-50');
    this.depedencies.forEach(dep => {
      if (tasks.find(task => task.id === dep.id) === undefined)
        this.depedencies.splice(this.depedencies.indexOf(dep), 1);
      else if (dep.list !== 4) button.classList.add('opacity-50');
    });
  }

  updateProgress() {
    const progress = this.element.children[0].children[1];
    progress.classList.toggle('d-none', this.subtasks.length === 0);
    if (this.subtasks.length === 0) return;

    const max = this.subtasks.length;
    let current = 0;
    this.subtasks.forEach(sub => current += +sub.completed);
    progress.children[0].style.width = (current / max * 100) + '%';
    progress.children[0].classList = 'progress-bar bg-' + this.getDeadlineBasedColor();
  }

  delete() {
    utilities.request('/api/tables/' + table.id + '/tasks/' + this.id, 'DELETE')
      .then(_ => {
        this.element.remove();
        tasks.splice(tasks.findIndex(task => task.id === this.id), 1);
        this.tags.forEach(tag => tag.removeFromTask(this));
      })
      .catch(err => alert(err));
  }

  serialize() {
    return {
      'name': this.name,
      'description': this.description,
      'deadline': this.deadline,
      'list': this.list,
      'subtasks': this.subtasks.map(sub => new Object({
        'name': sub.name,
        'completed': sub.completed
      })),
      'tags': this.tags.map(tag => tag.id),
      'depedencies': this.depedencies.map(dep => dep.id)
    };
  }

  deserialize(data) {
    if (data.name) this.name = data.name;
    if (data.description) this.description = data.description;
    if (data.deadline) this.deadline = data.deadline;
    if (data.list) this.list = data.list;

    if (data.subtasks) {
      data.subtasks.forEach(data => {
        const subtask = new Subtask(data);
        subtask.bindElementToTask(subtask.generateElement(), this);
      });
    }
    if (data.tags)
      this.tags = data.tags.map(id => tags.list.find(tag => tag.id === id));
    if (data.depedencies)
      this.depedencies = data.depedencies.map(id => tasks.find(task => task.id === id));

    this.update();
    this.element.remove();
    lists[this.list].prepend(this.element);
  }
}

module.exports = {
  list: tasks,
  create: (...args) => new Task(...args)
};
